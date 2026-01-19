import { CalendarIcon, ClockIcon, CreditCardIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type PhoneMockupProps = {
  size?: 'default' | 'large'
}

type MockupScreenProps = {
  isLarge: boolean
}

const MockupHeader = ({ isLarge }: MockupScreenProps) => {
  return (
    <div
      className={cn(
        'flex items-center',
        isLarge ? 'mb-5 gap-3' : 'mb-4 gap-2.5'
      )}
    >
      <img
        src="/logo.webp"
        alt="Pasio Padel Club"
        className={cn(
          'rounded-xl bg-white/20 object-contain',
          isLarge ? 'size-11 p-1' : 'size-9 p-0.5'
        )}
      />
      <div>
        <p
          className={cn(
            'font-display font-bold text-white',
            isLarge ? 'text-sm' : 'text-xs'
          )}
        >
          Pasio Padel
        </p>
        <p
          className={cn(
            'text-white/70',
            isLarge ? 'text-[11px]' : 'text-[9px]'
          )}
        >
          Bienvenue, Victor
        </p>
      </div>
    </div>
  )
}

const MockupBookingCard = ({ isLarge }: MockupScreenProps) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-white/95 shadow-lg',
        isLarge ? 'p-3.5' : 'p-2.5'
      )}
    >
      <div
        className={cn(
          'flex items-center',
          isLarge ? 'mb-2 gap-2' : 'mb-1.5 gap-2'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-lg bg-primary/20',
            isLarge ? 'size-8' : 'size-6'
          )}
        >
          <CalendarIcon
            className={cn('text-primary', isLarge ? 'size-4' : 'size-3')}
          />
        </div>
        <div>
          <p
            className={cn(
              'font-semibold text-slate-900',
              isLarge ? 'text-[13px]' : 'text-[11px]'
            )}
          >
            Court Double A
          </p>
          <p
            className={cn(
              'text-slate-500',
              isLarge ? 'text-[10px]' : 'text-[8px]'
            )}
          >
            Demain, 18h30
          </p>
        </div>
      </div>
      <div className={cn('flex', isLarge ? 'gap-2' : 'gap-1.5')}>
        <button
          type="button"
          className={cn(
            'flex-1 rounded-lg bg-red-100 font-medium text-red-600',
            isLarge ? 'h-7 text-[11px]' : 'h-5 rounded-md text-[9px]'
          )}
        >
          Annuler
        </button>
        <button
          type="button"
          className={cn(
            'flex-1 rounded-lg bg-primary font-medium text-white',
            isLarge ? 'h-7 text-[11px]' : 'h-5 rounded-md text-[9px]'
          )}
        >
          Détails
        </button>
      </div>
    </div>
  )
}

const MockupInfoCards = ({ isLarge }: MockupScreenProps) => {
  return (
    <div className={cn('space-y-1.5', isLarge ? 'mt-2.5 space-y-2' : 'mt-2')}>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg bg-white/90 shadow-sm',
          isLarge ? 'p-2.5' : 'p-2'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-md bg-emerald-100',
            isLarge ? 'size-6' : 'size-5'
          )}
        >
          <CreditCardIcon
            className={cn('text-emerald-600', isLarge ? 'size-3' : 'size-2.5')}
          />
        </div>
        <div className="flex-1">
          <p
            className={cn(
              'font-medium text-slate-900',
              isLarge ? 'text-[11px]' : 'text-[9px]'
            )}
          >
            Solde crédits
          </p>
          <p
            className={cn(
              'text-slate-500',
              isLarge ? 'text-[9px]' : 'text-[7px]'
            )}
          >
            120 € disponibles
          </p>
        </div>
      </div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg bg-white/90 shadow-sm',
          isLarge ? 'p-2.5' : 'p-2'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-md bg-primary/20',
            isLarge ? 'size-6' : 'size-5'
          )}
        >
          <ClockIcon
            className={cn('text-primary', isLarge ? 'size-3' : 'size-2.5')}
          />
        </div>
        <div className="flex-1">
          <p
            className={cn(
              'font-medium text-slate-900',
              isLarge ? 'text-[11px]' : 'text-[9px]'
            )}
          >
            Historique
          </p>
          <p
            className={cn(
              'text-slate-500',
              isLarge ? 'text-[9px]' : 'text-[7px]'
            )}
          >
            12 matchs ce mois
          </p>
        </div>
      </div>
    </div>
  )
}

export const PhoneMockup = ({ size = 'default' }: PhoneMockupProps) => {
  const isLarge = size === 'large'

  return (
    <div
      className={cn('relative mx-auto', isLarge ? 'w-[280px]' : 'w-[240px]')}
    >
      <div
        className={cn(
          'absolute rounded-l-sm bg-slate-800',
          isLarge
            ? '-left-[3px] top-[100px] h-8 w-[3px]'
            : '-left-[2px] top-[85px] h-6 w-[2px]'
        )}
      />
      <div
        className={cn(
          'absolute rounded-l-sm bg-slate-800',
          isLarge
            ? '-left-[3px] top-[150px] h-14 w-[3px]'
            : '-left-[2px] top-[128px] h-12 w-[2px]'
        )}
      />
      <div
        className={cn(
          'absolute rounded-l-sm bg-slate-800',
          isLarge
            ? '-left-[3px] top-[210px] h-14 w-[3px]'
            : '-left-[2px] top-[178px] h-12 w-[2px]'
        )}
      />
      <div
        className={cn(
          'absolute rounded-r-sm bg-slate-800',
          isLarge
            ? '-right-[3px] top-[140px] h-20 w-[3px]'
            : '-right-[2px] top-[118px] h-16 w-[2px]'
        )}
      />
      <div
        className={cn(
          'relative z-10 overflow-hidden border-slate-900 bg-slate-900 shadow-[0_0_0_2px_rgba(71,85,105,0.3),0_25px_50px_-12px_rgba(0,0,0,0.5)]',
          isLarge
            ? 'rounded-[50px] border-[10px]'
            : 'rounded-[44px] border-[8px]'
        )}
      >
        <div
          className={cn(
            'absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-end rounded-full bg-black',
            isLarge
              ? 'top-2 h-[30px] w-[100px] gap-2 px-3'
              : 'top-1.5 h-[26px] w-[85px] gap-1.5 px-2.5'
          )}
        >
          <div
            className={cn(
              'rounded-full bg-slate-800 ring-1 ring-slate-700',
              isLarge ? 'size-3' : 'size-2.5'
            )}
          />
        </div>
        <div className="relative aspect-[9/19.5] w-full overflow-hidden bg-gradient-to-b from-primary to-primary/80">
          <div
            className={cn(
              'flex h-full flex-col',
              isLarge ? 'p-4 pt-14' : 'p-3.5 pt-12'
            )}
          >
            <MockupHeader isLarge={isLarge} />
            <div
              className={cn(
                'font-medium text-white/70',
                isLarge ? 'mb-2 text-[11px]' : 'mb-1.5 text-[9px]'
              )}
            >
              Prochaine réservation
            </div>
            <MockupBookingCard isLarge={isLarge} />
            <MockupInfoCards isLarge={isLarge} />
          </div>
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 rounded-full bg-white/30',
              isLarge ? 'bottom-2 h-1 w-32' : 'bottom-1.5 h-1 w-24'
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 rounded-full bg-slate-900/15 blur-2xl',
          isLarge ? '-bottom-6 h-10 w-52' : '-bottom-5 h-8 w-44'
        )}
      />
    </div>
  )
}
