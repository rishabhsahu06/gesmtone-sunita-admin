
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import api from "@/lib/axiosInstanc" 

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Make API call to your login endpoint
          const response = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })

          const { data } = response

          // If login successful, return user object with all API data
          if (data && data.success && data.token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              phone: data.user.phone,
              role: data.user.role,
              address: data.user.address,
              createdAt: data.user.createdAt,
              updatedAt: data.user.updatedAt,
              accessToken: data.token,
            }
          }
          
          // If login failed
          return null
        } catch (error) {
          console.error("Login error:", error)
          // You can throw an error with a custom message
          throw new Error(error.response?.data?.message || "Invalid credentials")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist all user data to the token right after signin
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.phone = user.phone
        token.role = user.role
        token.address = user.address
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
      }
      return token
    },
    async session({ session, token }) {
      // Send all properties to the client session
      session.accessToken = token.accessToken
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        phone: token.phone,
        role: token.role,
        address: token.address,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      }
      return session
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }