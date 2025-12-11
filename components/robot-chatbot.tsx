"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { MessageCircle, X, Send, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import * as THREE from "three"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

function RobotHead({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    targetRotation.current = {
      x: mousePosition.y * 0.3,
      y: mousePosition.x * 0.4,
    }
  }, [mousePosition])

  useFrame(() => {
    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotation.current.x, 0.08)
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotation.current.y, 0.08)
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeOffsetX = mousePosition.x * 0.05
      const eyeOffsetY = mousePosition.y * 0.03

      leftEyeRef.current.position.x = -0.25 + eyeOffsetX
      leftEyeRef.current.position.y = 0.15 + eyeOffsetY

      rightEyeRef.current.position.x = 0.25 + eyeOffsetX
      rightEyeRef.current.position.y = 0.15 + eyeOffsetY
    }
  })

  return (
    <group ref={headRef} position={[0, 0, 0]}>
      {/* Main head - rounded cube shape */}
      <mesh>
        <boxGeometry args={[1.4, 1.2, 1]} />
        <meshStandardMaterial color="#f5f0e8" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Face plate */}
      <mesh position={[0, 0, 0.45]}>
        <boxGeometry args={[1.1, 0.9, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Left eye */}
      <mesh ref={leftEyeRef} position={[-0.25, 0.15, 0.55]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.8} />
      </mesh>

      {/* Right eye */}
      <mesh ref={rightEyeRef} position={[0.25, 0.15, 0.55]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.8} />
      </mesh>

      {/* Mouth - horizontal line */}
      <mesh position={[0, -0.2, 0.55]}>
        <boxGeometry args={[0.4, 0.05, 0.02]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>

      {/* Ear pieces */}
      <mesh position={[-0.75, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#666666" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.75, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#666666" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

const botResponses = [
  "Hello! I'm your daily activity assistant. How can I help you today?",
  "I can help you track activities, manage leaves, or check your monthly reports.",
  "Would you like me to help you submit today's activity report?",
  "Your leave balance is looking good! You have 15 days remaining.",
  "I notice you haven't submitted today's activity yet. Would you like to do that now?",
  "Great question! Let me help you with that.",
  "I'm here to make your work tracking easier. What do you need?",
]

export function RobotChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = -(e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
        >
          <MessageCircle className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className={cn(
            "fixed z-50 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
            isMinimized ? "bottom-6 right-6 w-72 h-20" : "bottom-6 right-6 w-96 h-[600px]",
          )}
        >
          {/* Header with 3D Robot */}
          <div className="relative h-32 bg-gradient-to-b from-primary/20 to-transparent">
            <div className="absolute inset-0">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <RobotHead mousePosition={mousePosition} />
                <Environment preset="studio" />
              </Canvas>
            </div>
            <div className="absolute top-3 right-3 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-background/50 hover:bg-background/80"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-background/50 hover:bg-background/80"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="h-[380px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5",
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md",
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-[10px] opacity-60 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
