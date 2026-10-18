import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Device = {
  id: string
  name: string
  location: string | null
  is_online: boolean
  last_seen: string | null
  esp_mac: string
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data, error } = await supabase
      .from('devices')
      .select('id,name,location,is_online,last_seen,esp_mac')
      .order('created_at', { ascending: false })
    if (!error) setDevices((data as Device[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('devices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => load())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis dispositivos</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
          {devices.length} dispositivo(s)
        </span>
      </div>

      {loading ? (
        <p className="text-slate-400">Cargando dispositivos…</p>
      ) : devices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
          <p className="mb-2 text-4xl">💧</p>
          <p className="font-semibold text-white">Aún no tienes dispositivos</p>
          <p className="mt-1 text-sm text-slate-400">
            Cuando registres tu primer ESP8266 (AGUAMATIC), aparecerá aquí en tiempo real.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map(d => (
            <div key={d.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-white">{d.name}</h3>
                <span className={`h-2.5 w-2.5 rounded-full ${d.is_online ? 'bg-emerald-400' : 'bg-red-500'}`} />
              </div>
              <p className="text-sm text-slate-400">{d.location ?? 'Sin ubicación'}</p>
              <p className="mt-1 text-xs text-slate-500">MAC: {d.esp_mac}</p>
              <p className="mt-1 text-xs text-slate-500">
                Última conexión: {d.last_seen ? new Date(d.last_seen).toLocaleString() : '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}