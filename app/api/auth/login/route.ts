export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // Mock validation - replace with actual backend call
  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 })
  }

  const mockUser = {
    id: "1",
    email,
    name: "John Doe",
    profileStrength: 65,
  }

  return Response.json(mockUser)
}
