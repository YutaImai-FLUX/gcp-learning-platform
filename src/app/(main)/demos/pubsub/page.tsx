"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Radio, Plus, Send, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DemoShell } from "@/components/demos/DemoShell"

interface Message {
  id: string
  topicId: string
  data: string
  attributes: Record<string, string>
  publishTime: string
  ackId: string
  acked: boolean
}

export default function PubSubDemo() {
  const [topicName, setTopicName] = useState("my-topic")
  const [topics, setTopics] = useState<{ name: string; subscriptions: string[] }[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [subName, setSubName] = useState("my-subscription")
  const [messageData, setMessageData] = useState('{"event":"user.action","userId":"u123"}')
  const [messages, setMessages] = useState<Message[]>([])
  const [publishing, setPublishing] = useState(false)
  const [attributeKey, setAttributeKey] = useState("source")
  const [attributeVal, setAttributeVal] = useState("web-app")
  const bottomRef = useRef<HTMLDivElement>(null)
  const msgCounterRef = useRef(1)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function createTopic() {
    if (!topicName || topics.find((t) => t.name === topicName)) return
    setTopics((prev) => [...prev, { name: topicName, subscriptions: [] }])
    setSelectedTopic(topicName)
    setTopicName(`my-topic-${topics.length + 2}`)
  }

  function addSubscription() {
    if (!selectedTopic || !subName) return
    setTopics((prev) =>
      prev.map((t) =>
        t.name === selectedTopic && !t.subscriptions.includes(subName)
          ? { ...t, subscriptions: [...t.subscriptions, subName] }
          : t
      )
    )
    setSubName(`my-subscription-${Date.now()}`)
  }

  async function publish() {
    if (!selectedTopic) return
    setPublishing(true)
    await new Promise((r) => setTimeout(r, 400))

    const topic = topics.find((t) => t.name === selectedTopic)
    const msg: Message = {
      id: `msg-${String(msgCounterRef.current++).padStart(4, "0")}`,
      topicId: selectedTopic,
      data: messageData,
      attributes: { [attributeKey]: attributeVal },
      publishTime: new Date().toISOString(),
      ackId: `ack-${Math.random().toString(36).slice(2, 8)}`,
      acked: false,
    }
    setMessages((prev) => [...prev, msg])

    // Auto-deliver to subscribers after a small delay
    if (topic && topic.subscriptions.length > 0) {
      await new Promise((r) => setTimeout(r, 800))
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, acked: false } : m))
      )
    }
    setPublishing(false)
  }

  function ackMessage(msgId: string) {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, acked: true } : m)))
  }

  const currentTopic = topics.find((t) => t.name === selectedTopic)
  const pendingMessages = messages.filter((m) => m.topicId === selectedTopic && !m.acked)
  const ackedMessages = messages.filter((m) => m.topicId === selectedTopic && m.acked)

  return (
    <DemoShell
      title="Pub/Sub"
      description="メッセージのパブリッシュとサブスクライブをリアルタイムで体験します"
      service="Pub/Sub"
      color="#FBBC05"
      demoId="pubsub"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Topics & Subscriptions */}
        <div className="space-y-4">
          {/* Topic creator */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">トピック</h3>
            <div className="flex gap-2">
              <Input
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="my-topic"
                className="font-mono text-xs h-8"
              />
              <Button onClick={createTopic} disabled={!topicName} size="sm" className="h-8 bg-gcp-yellow text-white hover:bg-gcp-yellow/90 shrink-0">
                <Plus size={14} />
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {topics.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTopic(t.name)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                    selectedTopic === t.name
                      ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Radio size={13} />
                  <span className="font-mono flex-1 truncate">{t.name}</span>
                  <Badge variant="secondary" className="text-xs">{t.subscriptions.length} subs</Badge>
                </button>
              ))}
              {topics.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3">トピックを作成してください</p>
              )}
            </div>
          </div>

          {/* Subscriptions */}
          {currentTopic && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                サブスクリプション
              </h3>
              <div className="flex gap-2">
                <Input
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="my-subscription"
                  className="font-mono text-xs h-8"
                />
                <Button onClick={addSubscription} size="sm" className="h-8 shrink-0" variant="outline">
                  <Plus size={14} />
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {currentTopic.subscriptions.map((sub) => (
                  <div key={sub} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs">
                    <Inbox size={12} className="text-gcp-blue shrink-0" />
                    <span className="font-mono truncate">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Publish + Message stream */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTopic ? (
            <>
              {/* Publish */}
              <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Send size={14} />
                  メッセージをパブリッシュ (トピック: <span className="font-mono text-gcp-yellow">{selectedTopic}</span>)
                </h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">メッセージデータ (JSON)</label>
                  <textarea
                    value={messageData}
                    onChange={(e) => setMessageData(e.target.value)}
                    className="w-full h-20 code-editor-bg rounded-lg p-3 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-gcp-yellow/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">属性キー</label>
                    <Input value={attributeKey} onChange={(e) => setAttributeKey(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">属性値</label>
                    <Input value={attributeVal} onChange={(e) => setAttributeVal(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                </div>
                <Button
                  onClick={publish}
                  disabled={publishing || !messageData}
                  className="bg-gcp-yellow text-white hover:bg-gcp-yellow/90"
                  size="sm"
                >
                  <Send size={14} className="mr-1.5" />
                  {publishing ? "配信中..." : "パブリッシュ"}
                </Button>
              </div>

              {/* Message stream */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    メッセージストリーム
                    {pendingMessages.length > 0 && (
                      <Badge className="ml-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs border-0">
                        {pendingMessages.length} 未ACK
                      </Badge>
                    )}
                  </h3>
                  {ackedMessages.length > 0 && (
                    <span className="text-xs text-muted-foreground">{ackedMessages.length} ACK済</span>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                  <AnimatePresence>
                    {[...messages].filter((m) => m.topicId === selectedTopic).reverse().map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                          msg.acked
                            ? "border-border bg-muted/30 opacity-50"
                            : "border-gcp-yellow/40 bg-yellow-50 dark:bg-yellow-950/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-gcp-yellow font-bold">{msg.id}</span>
                              {msg.acked ? (
                                <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">ACK</Badge>
                              ) : (
                                <Badge className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-0">配信済</Badge>
                              )}
                            </div>
                            <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all text-xs">
                              {msg.data}
                            </pre>
                            <div className="text-muted-foreground text-xs">
                              {attributeKey}: {msg.attributes[attributeKey]} · {new Date(msg.publishTime).toLocaleTimeString("ja-JP")}
                            </div>
                          </div>
                          {!msg.acked && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => ackMessage(msg.id)}
                              className="h-7 text-xs shrink-0"
                            >
                              ACK
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {messages.filter((m) => m.topicId === selectedTopic).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      メッセージをパブリッシュすると、ここに表示されます
                    </div>
                  )}
                </div>
                <div ref={bottomRef} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm gap-2">
              <Radio size={40} className="opacity-20" />
              <p>左からトピックを選択または作成してください</p>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  )
}
