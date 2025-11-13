export async function GET(request: Request) {
  // Mock endpoint - replace with actual backend call
  const mockUser = {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    profileStrength: 65,
  }

  return Response.json(mockUser)
}
