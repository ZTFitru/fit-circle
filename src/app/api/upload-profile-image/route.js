import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    await connectDB()
    
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const formData = await request.formData()
    const file = formData.get('profileImage')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public/uploads/profiles')
    await mkdir(uploadsDir, { recursive: true })

    const fileExtension = path.extname(file.name)
    const filename = `profile-${userId}-${Date.now()}${fileExtension}`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    const imageUrl = `/uploads/profiles/${filename}`
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    user.profileImage = imageUrl
    await user.save()

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      friends: user.friends,
      totalWorkouts: user.totalWorkouts,
      totalWeight: user.totalWeight,
      badges: user.badges,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      user: userResponse,
      message: 'Profile image updated successfully',
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }
}