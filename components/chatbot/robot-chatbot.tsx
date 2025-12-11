"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import * as THREE from "three"
import { X, Send, RefreshCw, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

// 3D Robot Head Component
function RobotHead({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (headRef.current) {
      // Smooth head rotation following cursor
      const targetRotationY = mousePosition.x * 0.3
      const targetRotationX = -mousePosition.y * 0.2

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.1)
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, 0.1)
    }

    // Eye tracking
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeTargetX = mousePosition.x * 0.1
      const eyeTargetY = mousePosition.y * 0.1

      leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.25 + eyeTargetX, 0.15)
      leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, 0.15 + eyeTargetY, 0.15)

      rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.25 + eyeTargetX, 0.15)
      rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, 0.15 + eyeTargetY, 0.15)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={headRef}>
        {/* Main Head */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 1, 0.8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Face Plate */}
        <mesh position={[0, 0, 0.35]}>
          <boxGeometry args={[1, 0.8, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Eye Sockets */}
        <mesh position={[-0.25, 0.15, 0.4]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0.25, 0.15, 0.4]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>

        {/* Eyes (pupils) */}
        <mesh ref={leftEyeRef} position={[-0.25, 0.15, 0.45]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.25, 0.15, 0.45]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
        </mesh>

        {/* Mouth/Speaker Grille */}
        <mesh position={[0, -0.2, 0.42]}>
          <boxGeometry args={[0.5, 0.12, 0.05]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={1} />
        </mesh>

        {/* Side Details */}
        <mesh position={[-0.65, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.3]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.65, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.3]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

// Scene Component
function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00ff88" />
      <RobotHead mousePosition={mousePosition} />
      <Environment preset="city" />
    </>
  )
}

export function RobotChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant for the Daily Activity Tracker. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Track mouse position for robot head
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        setMousePosition({
          x: (e.clientX - centerX) / (window.innerWidth / 2),
          y: (e.clientY - centerY) / (window.innerHeight / 2),
        })
      } else {
        setMousePosition({
          x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
          y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you track your daily activities and manage leaves. What would you like to know?",
        "You've logged 32 hours this week across 4 different projects. Great progress!",
        "Your current leave balance is 12 days. Would you like to apply for leave?",
        "I can show you a summary of your activities. Which time period interests you?",
        "Your productivity has increased by 15% compared to last month. Keep it up!",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }, [input])

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        content: "Chat reset! How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }

  return (
    <>
      {/* Floating Robot Button */}
      <motion.div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.button
              key="fab"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 rounded-2xl bg-foreground text-background shadow-lg overflow-hidden"
            >
              <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
                <Scene mousePosition={mousePosition} />
              </Canvas>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with 3D Robot */}
            <div className="relative h-32 bg-gradient-to-b from-foreground to-foreground/90">
              <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
                <Scene mousePosition={mousePosition} />
              </Canvas>

              {/* Header Controls */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Title */}
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/70">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", message.isUser && "flex-row-reverse")}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        message.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {message.isUser ? "U" : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={cn(
                        "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm",
                        message.isUser
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : "bg-secondary text-secondary-foreground rounded-tl-md",
                      )}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-md">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-secondary/50"
                />
                <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
