"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HardDrive, FolderOpen, Upload, Trash2, Download,
  Plus, Image, Table, Braces, Brain, Archive, Globe, FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DemoShell } from "@/components/demos/DemoShell"
import { GCS_MOCK_FILES, GCS_STORAGE_CLASSES, type MockFile } from "@/lib/data/demo-data"

const ICON_MAP: Record<string, React.ElementType> = {
  Image, Table, Braces, Brain, Archive, Globe, FileText,
}

export default function GCSDemo() {
  const [bucketName, setBucketName] = useState("")
  const [storageClass, setStorageClass] = useState("STANDARD")
  const [buckets, setBuckets] = useState<{ name: string; storageClass: string; files: MockFile[] }[]>([])
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (notifTimerRef.current) clearTimeout(notifTimerRef.current) }
  }, [])

  function showNotification(msg: string) {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current)
    setNotification(msg)
    notifTimerRef.current = setTimeout(() => setNotification(null), 3000)
  }

  function createBucket() {
    if (!bucketName || buckets.find((b) => b.name === bucketName)) return
    const newBucket = { name: bucketName, storageClass, files: [...GCS_MOCK_FILES] }
    setBuckets((prev) => [...prev, newBucket])
    setSelectedBucket(bucketName)
    showNotification(`バケット "${bucketName}" を作成しました`)
    setBucketName("")
  }

  async function uploadFile(file: File) {
    if (!selectedBucket) return
    setUploading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const newFile: MockFile = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "application/octet-stream",
      updated: new Date().toISOString().split("T")[0],
      icon: "FileText",
    }
    setBuckets((prev) =>
      prev.map((b) =>
        b.name === selectedBucket ? { ...b, files: [newFile, ...b.files] } : b
      )
    )
    setUploading(false)
    showNotification(`"${file.name}" をアップロードしました`)
  }

  function deleteFile(fileName: string) {
    setBuckets((prev) =>
      prev.map((b) =>
        b.name === selectedBucket
          ? { ...b, files: b.files.filter((f) => f.name !== fileName) }
          : b
      )
    )
    showNotification(`"${fileName}" を削除しました`)
  }

  const currentBucket = buckets.find((b) => b.name === selectedBucket)
  const selectedClass = GCS_STORAGE_CLASSES.find((c) => c.id === storageClass)

  return (
    <DemoShell
      title="Cloud Storage"
      description="オブジェクトストレージのバケットとファイルを管理します"
      service="Cloud Storage"
      color="#4285F4"
      demoId="gcs"
    >
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm px-4 py-2.5 rounded-lg"
          >
            ✓ {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Bucket list */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <HardDrive size={15} />
            バケット ({buckets.length})
          </h3>

          {/* Create bucket */}
          <div className="space-y-2 p-3 bg-muted rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground">バケットを作成</p>
            <Input
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="my-bucket-name"
              className="font-mono text-xs h-8"
            />
            <Select value={storageClass} onValueChange={(v) => v && setStorageClass(v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GCS_STORAGE_CLASSES.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({cls.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClass && (
              <p className="text-xs text-muted-foreground">{selectedClass.access}</p>
            )}
            <Button onClick={createBucket} disabled={!bucketName} size="sm" className="w-full h-7 text-xs bg-gcp-blue hover:bg-gcp-blue-dark text-white">
              <Plus size={12} className="mr-1" />作成
            </Button>
          </div>

          {/* Bucket list */}
          <div className="space-y-1.5">
            {buckets.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBucket(b.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  selectedBucket === b.name
                    ? "bg-gcp-blue-light dark:bg-gcp-blue/20 text-gcp-blue-dark dark:text-gcp-blue"
                    : "hover:bg-muted"
                }`}
              >
                <FolderOpen size={15} className="shrink-0" />
                <div className="min-w-0">
                  <div className="font-mono text-xs font-medium truncate">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.storageClass} · {b.files.length} files</div>
                </div>
              </button>
            ))}
            {buckets.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">バケットがありません</p>
            )}
          </div>
        </div>

        {/* Right: File browser */}
        <div className="lg:col-span-2 space-y-3">
          {currentBucket ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">
                  gs://<span className="text-gcp-blue">{currentBucket.name}</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
                  />
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="h-8 text-xs bg-gcp-blue hover:bg-gcp-blue-dark text-white"
                  >
                    <Upload size={12} className="mr-1.5" />
                    {uploading ? "アップロード中..." : "ファイルをアップロード"}
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted text-muted-foreground">
                      <th className="text-left px-3 py-2 font-medium">名前</th>
                      <th className="text-left px-3 py-2 font-medium">サイズ</th>
                      <th className="text-left px-3 py-2 font-medium">更新日</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {currentBucket.files.map((file) => {
                        const FileIcon = ICON_MAP[file.icon] ?? FileText
                        return (
                          <motion.tr
                            key={file.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-t border-border hover:bg-muted/50"
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <FileIcon size={14} className="text-gcp-blue shrink-0" />
                                <span className="font-mono truncate max-w-[160px]">{file.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{file.size}</td>
                            <td className="px-3 py-2 text-muted-foreground">{file.updated}</td>
                            <td className="px-3 py-2">
                              <div className="flex gap-1 justify-end">
                                <Button variant="ghost" size="icon" className="h-6 w-6" title="ダウンロード">
                                  <Download size={12} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => deleteFile(file.name)}
                                  title="削除"
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Storage class info */}
              <Card className="border-border">
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {GCS_STORAGE_CLASSES.map((cls) => (
                      <div
                        key={cls.id}
                        className={`p-2 rounded text-center text-xs border ${
                          currentBucket.storageClass === cls.id
                            ? "border-gcp-blue bg-gcp-blue-light dark:bg-gcp-blue/20 text-gcp-blue"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <div className="font-medium">{cls.name}</div>
                        <div className="font-mono mt-0.5">{cls.price}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm gap-2">
              <FolderOpen size={40} className="opacity-20" />
              <p>左からバケットを選択してください</p>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  )
}
