export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, name } = body

  // Mock validation - replace with actual backend call
  if (!email || !password || !name) {
    return Response.json({ error: "All fields are required" }, { status: 400 })
  }

  const mockUser = {
    id: "1",
    email,
    name,
    profileStrength: 0,
  }

  return Response.json(mockUser)
}
