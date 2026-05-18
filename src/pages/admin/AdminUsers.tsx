import { useEffect, useState, type FormEvent } from 'react'
import { Crown, Mail, Pencil, Trash2, UserPlus } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { cn, formatDateBR, getInitials } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/toast'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import type { AdminUser, AdminRole } from '@/types'

interface InviteFormState {
  email: string
  name: string
  role: AdminRole
}

const EMPTY_INVITE: InviteFormState = {
  email: '',
  name: '',
  role: 'editor',
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState<InviteFormState>(EMPTY_INVITE)
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Usuários — AURI Admin' })
    void fetchAdmins()
  }, [])

  async function fetchAdmins() {
    setLoading(true)
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true })
    setAdmins((data as AdminUser[] | null) ?? [])
    setLoading(false)
  }

  async function handleInvite(e: FormEvent) {
    e.preventDefault()
    const email = invite.email.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      toast('E-mail inválido', 'error')
      return
    }

    setInviting(true)
    const { data, error } = await supabase.functions.invoke('invite-admin', {
      body: { email, name: invite.name.trim() || null, role: invite.role },
    })
    setInviting(false)

    if (error) {
      toast(`Erro ao convidar: ${error.message}`, 'error')
      return
    }
    if (data?.error) {
      toast(`Erro ao convidar: ${data.error}`, 'error')
      return
    }

    toast('Convite enviado! O novo admin receberá e-mail para definir a senha.', 'success')
    setInviteOpen(false)
    setInvite(EMPTY_INVITE)
    void fetchAdmins()
  }

  async function handleChangeRole(admin: AdminUser, newRole: AdminRole) {
    if (admin.id === currentUser?.id && newRole !== 'owner') {
      toast('Você não pode rebaixar a si mesmo', 'error')
      return
    }
    const { error } = await supabase
      .from('admin_users')
      .update({ role: newRole })
      .eq('id', admin.id)
    if (error) {
      toast(`Erro: ${error.message}`, 'error')
      return
    }
    setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, role: newRole } : a))
    toast(`Role alterado para ${newRole}`, 'success')
  }

  async function handleRemove(admin: AdminUser) {
    if (admin.id === currentUser?.id) {
      toast('Você não pode remover a si mesmo', 'error')
      return
    }
    const { error } = await supabase.from('admin_users').delete().eq('id', admin.id)
    if (error) {
      toast(`Erro: ${error.message}`, 'error')
      return
    }
    setAdmins(prev => prev.filter(a => a.id !== admin.id))
    toast('Admin removido', 'success')
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Usuários do painel</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {admins.length} admin{admins.length === 1 ? '' : 's'} cadastrado{admins.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button variant="gold" onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Convidar admin
        </Button>
      </header>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : admins.length === 0 ? (
        <div className="rounded-xl border border-ink-100 bg-card p-12 text-center dark:border-ink-700">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Nenhum admin cadastrado.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {admins.map(admin => {
            const isMe = admin.id === currentUser?.id
            const isOwner = admin.role === 'owner'
            return (
              <li
                key={admin.id}
                className={cn(
                  'flex flex-col gap-3 rounded-lg border border-ink-100 bg-card p-4 dark:border-ink-700 sm:flex-row sm:items-center',
                  isMe && 'border-gold-500/40 bg-gold-500/5',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold ring-1',
                    isOwner
                      ? 'bg-gradient-to-br from-gold-500 to-gold-700 text-ink-900 ring-gold-500/40'
                      : 'bg-ink-800 text-gold-400 ring-gold-400/30',
                  )}
                  aria-hidden="true"
                >
                  {getInitials(admin.name ?? 'A')}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink-800 dark:text-ink-50">
                      {admin.name ?? 'Sem nome'}
                    </p>
                    {isMe && (
                      <span className="rounded bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-900">
                        Você
                      </span>
                    )}
                    {isOwner && (
                      <span className="inline-flex items-center gap-1 rounded border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                        <Crown className="h-3 w-3" aria-hidden="true" /> Owner
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-ink-500">
                    {admin.id.slice(0, 8)}… · criado em {formatDateBR(admin.created_at)}
                  </p>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChangeRole(admin, isOwner ? 'editor' : 'owner')}
                    disabled={isMe && isOwner}
                    aria-label={`Alterar para ${isOwner ? 'editor' : 'owner'}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Tornar {isOwner ? 'editor' : 'owner'}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isMe}
                        aria-label="Remover admin"
                        className="text-danger hover:text-danger disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover acesso de "{admin.name ?? 'admin'}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          O usuário perderá acesso ao painel. A conta de e-mail/senha continua existindo no Supabase Auth (você pode deletá-la lá se quiser).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel />
                        <AlertDialogAction onClick={() => handleRemove(admin)}>Remover</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="max-w-md" ariaLabel="Convidar admin">
        <form onSubmit={handleInvite} className="p-6">
          <h2 className="mb-1 font-serif text-2xl text-ink-800 dark:text-ink-50">Convidar admin</h2>
          <p className="mb-4 text-xs text-ink-500">
            <Mail className="mr-1 inline h-3 w-3" aria-hidden="true" />
            Um e-mail será enviado para o convidado definir a senha.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="inv-email">E-mail</Label>
              <Input
                id="inv-email"
                type="email"
                required
                value={invite.email}
                onChange={e => setInvite(prev => ({ ...prev, email: e.target.value }))}
                placeholder="novo.admin@email.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="inv-name">Nome (opcional)</Label>
              <Input
                id="inv-name"
                value={invite.name}
                onChange={e => setInvite(prev => ({ ...prev, name: e.target.value }))}
                placeholder="João da Silva"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="inv-role">Permissão</Label>
              <select
                id="inv-role"
                value={invite.role}
                onChange={e => setInvite(prev => ({ ...prev, role: e.target.value as AdminRole }))}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              >
                <option value="editor">Editor (CRUD de conteúdo)</option>
                <option value="owner">Owner (acesso total + gerencia outros admins)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="gold" disabled={inviting}>
              {inviting ? 'Enviando…' : 'Enviar convite'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
