import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem as SelectMenuItem,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StorefrontIcon from '@mui/icons-material/Storefront'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import {
  adminActivateMenu,
  adminAddMenuItem,
  adminCreateMenu,
  adminDeactivateMenu,
  adminDeleteMenu,
  adminDeleteMenuItem,
  adminListDishes,
  adminListMenus,
  adminReorderMenus,
  adminReorderMenuItems,
  adminUpdateMenu,
  adminUpdateMenuItem,
  type MenuItemRequest,
  type MenuRequest,
} from '@/services/contentApi'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import ImageUploadField from '@/components/admin/ImageUploadField'
import type { Dish, Menu, MenuItem } from '@/types'

const CATEGORIES = [
  { value: '', label: 'Nessuna / libera' },
  { value: 'antipasti', label: 'Antipasti' },
  { value: 'primi', label: 'Primi' },
  { value: 'secondi', label: 'Secondi' },
  { value: 'dolci', label: 'Dolci' },
]

const EMPTY_MENU_FORM: MenuRequest = { name: '', description: '' }

const EMPTY_ITEM_FORM: MenuItemRequest = { name: '', category: '', description: '', imageUrl: null, price: 0 }

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

interface AdminMenuPageProps {
  /** 'SHOP' = menu del negozio fisico, 'EVENTS' = menu per gli eventi. */
  type?: 'SHOP' | 'EVENTS'
}

export default function AdminMenuPage({ type = 'SHOP' }: AdminMenuPageProps) {
  const copy =
    type === 'EVENTS'
      ? {
          title: 'Menu eventi',
          intro:
            'Crea liste di piatti (dal catalogo "A MoDo mio" o del tutto nuovi) con un prezzo dedicato agli eventi. Un solo menu alla volta può essere segnato come attivo: è quello mostrato nella pagina Eventi come proposta in evidenza.',
          activeChip: 'Attivo ora per gli eventi',
          activateVerb: 'Rendi attivo per gli eventi',
        }
      : {
          title: 'Menu del negozio',
          intro:
            'Crea liste di piatti (dal catalogo "A MoDo mio" o del tutto nuovi) con un prezzo dedicato. Un solo menu alla volta può essere segnato come attivo: è quello mostrato sul sito come il menu in vetrina per il negozio fisico in questo momento.',
          activeChip: 'Attivo ora nel negozio',
          activateVerb: 'Rendi attivo',
        }

  const [menus, setMenus] = useState<Menu[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyMenuId, setBusyMenuId] = useState<number | null>(null)

  // Dialog "menu" (nome + descrizione)
  const [menuDialogOpen, setMenuDialogOpen] = useState(false)
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null)
  const [menuForm, setMenuForm] = useState<MenuRequest>(EMPTY_MENU_FORM)
  const [savingMenu, setSavingMenu] = useState(false)
  const [deleteMenuTarget, setDeleteMenuTarget] = useState<Menu | null>(null)
  const [deletingMenu, setDeletingMenu] = useState(false)

  // Dialog "piatti del menu" (lista voci con prezzo)
  const [itemsMenuId, setItemsMenuId] = useState<number | null>(null)
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [itemForm, setItemForm] = useState<MenuItemRequest>(EMPTY_ITEM_FORM)
  const [prefillDishId, setPrefillDishId] = useState<number | ''>('')
  const [savingItem, setSavingItem] = useState(false)
  const [deleteItemTarget, setDeleteItemTarget] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState(false)

  const itemsMenu = useMemo(() => menus.find((m) => m.id === itemsMenuId) ?? null, [menus, itemsMenuId])

  const load = () => {
    setLoading(true)
    Promise.all([adminListMenus(type), adminListDishes()])
      .then(([menuList, dishList]) => {
        setMenus(menuList)
        setDishes(dishList)
      })
      .catch(() => setError('Impossibile caricare i menu'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [type])

  // --- Menu: crea/modifica/elimina/attiva --------------------------------

  const openCreateMenu = () => {
    setEditingMenuId(null)
    setMenuForm(EMPTY_MENU_FORM)
    setMenuDialogOpen(true)
  }

  const openEditMenu = (menu: Menu) => {
    setEditingMenuId(menu.id)
    setMenuForm({ name: menu.name, description: menu.description })
    setMenuDialogOpen(true)
  }

  const handleSaveMenu = async () => {
    setSavingMenu(true)
    try {
      if (editingMenuId) {
        await adminUpdateMenu(editingMenuId, menuForm)
      } else {
        await adminCreateMenu({ ...menuForm, type })
      }
      setMenuDialogOpen(false)
      load()
    } catch {
      setError('Salvataggio del menu non riuscito')
    } finally {
      setSavingMenu(false)
    }
  }

  const handleToggleActive = async (menu: Menu) => {
    setBusyMenuId(menu.id)
    try {
      if (menu.active) {
        await adminDeactivateMenu(menu.id)
      } else {
        await adminActivateMenu(menu.id)
      }
      load()
    } catch {
      setError('Impossibile aggiornare il menu attivo')
    } finally {
      setBusyMenuId(null)
    }
  }

  const handleDeleteMenu = async () => {
    if (!deleteMenuTarget) return
    setDeletingMenu(true)
    try {
      await adminDeleteMenu(deleteMenuTarget.id)
      setDeleteMenuTarget(null)
      load()
    } catch {
      setError('Eliminazione del menu non riuscita')
    } finally {
      setDeletingMenu(false)
    }
  }

  const handleReorderMenus = async (orderedIds: number[]) => {
    setMenus((prev) => orderedIds.map((id) => prev.find((m) => m.id === id)!).filter(Boolean))
    await adminReorderMenus(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  // --- Voci del menu: crea/modifica/elimina -------------------------------

  const openItemsDialog = (menu: Menu) => setItemsMenuId(menu.id)
  const closeItemsDialog = () => setItemsMenuId(null)

  const openCreateItem = () => {
    setEditingItemId(null)
    setItemForm(EMPTY_ITEM_FORM)
    setPrefillDishId('')
    setItemDialogOpen(true)
  }

  const openEditItem = (item: MenuItem) => {
    setEditingItemId(item.id)
    setItemForm({
      name: item.name,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      price: item.price,
    })
    setPrefillDishId('')
    setItemDialogOpen(true)
  }

  const handlePrefillFromDish = (dishId: number | '') => {
    setPrefillDishId(dishId)
    const dish = dishes.find((d) => d.id === dishId)
    if (!dish) return
    setItemForm((prev) => ({
      ...prev,
      name: dish.name,
      category: dish.category,
      description: dish.description,
      imageUrl: dish.imageUrl,
    }))
  }

  const handleSaveItem = async () => {
    if (!itemsMenuId) return
    setSavingItem(true)
    try {
      if (editingItemId) {
        await adminUpdateMenuItem(itemsMenuId, editingItemId, itemForm)
      } else {
        await adminAddMenuItem(itemsMenuId, itemForm)
      }
      setItemDialogOpen(false)
      load()
    } catch {
      setError('Salvataggio del piatto non riuscito')
    } finally {
      setSavingItem(false)
    }
  }

  const handleDeleteItem = async () => {
    if (!itemsMenuId || !deleteItemTarget) return
    setDeletingItem(true)
    try {
      await adminDeleteMenuItem(itemsMenuId, deleteItemTarget.id)
      setDeleteItemTarget(null)
      load()
    } catch {
      setError('Eliminazione del piatto non riuscita')
    } finally {
      setDeletingItem(false)
    }
  }

  const handleReorderItems = async (orderedIds: number[]) => {
    if (!itemsMenuId) return
    setMenus((prev) =>
      prev.map((m) =>
        m.id === itemsMenuId
          ? { ...m, items: orderedIds.map((id) => m.items.find((i) => i.id === id)!).filter(Boolean) }
          : m,
      ),
    )
    await adminReorderMenuItems(itemsMenuId, orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">{copy.title}</h1>
          <p className="text-clay">{copy.intro}</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateMenu}
          className="whitespace-nowrap bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          Nuovo menu
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : menus.length === 0 ? (
        <p className="text-clay">Nessun menu ancora. Creane uno per iniziare.</p>
      ) : (
        <ReorderableList
          items={menus}
          onReorder={handleReorderMenus}
          renderItem={(menu) => (
            <div className="rounded-xl border border-black/10 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-[200px] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{menu.name}</p>
                    {menu.active && (
                      <Chip
                        icon={<StorefrontIcon />}
                        label={copy.activeChip}
                        size="small"
                        className="bg-gold-500/[.18] font-semibold text-gold-600"
                      />
                    )}
                  </div>
                  <p className="text-[0.85rem] text-clay">
                    {menu.items.length} {menu.items.length === 1 ? 'piatto' : 'piatti'}
                    {menu.description ? ` · ${menu.description}` : ''}
                  </p>
                </div>
                <Button
                  size="small"
                  variant={menu.active ? 'outlined' : 'contained'}
                  disabled={busyMenuId === menu.id}
                  onClick={() => handleToggleActive(menu)}
                  className={
                    menu.active
                      ? 'border-ink/20 text-ink-soft normal-case'
                      : 'bg-olive text-ivory normal-case hover:bg-[#2C3424]'
                  }
                >
                  {menu.active ? 'Disattiva' : copy.activateVerb}
                </Button>
                <Button size="small" startIcon={<RestaurantMenuIcon />} onClick={() => openItemsDialog(menu)} className="normal-case">
                  Gestisci piatti
                </Button>
                <IconButton onClick={() => openEditMenu(menu)} aria-label="Modifica menu">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteMenuTarget(menu)} aria-label="Elimina menu">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          )}
        />
      )}

      {/* Dialog: crea/modifica menu */}
      <Dialog open={menuDialogOpen} onClose={() => setMenuDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMenuId ? 'Modifica menu' : 'Nuovo menu'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
            <TextField
              label="Nome del menu"
              placeholder='Es. "Menu del giorno", "Menu estivo 2026"'
              fullWidth
              value={menuForm.name}
              onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <TextField
              label="Descrizione"
              fullWidth
              multiline
              minRows={2}
              value={menuForm.description}
              onChange={(e) => setMenuForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuDialogOpen(false)} disabled={savingMenu} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={handleSaveMenu}
            variant="contained"
            disabled={savingMenu || !menuForm.name}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {savingMenu ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteMenuTarget}
        itemLabel={deleteMenuTarget?.name ?? ''}
        onCancel={() => setDeleteMenuTarget(null)}
        onConfirm={handleDeleteMenu}
        loading={deletingMenu}
      />

      {/* Dialog: gestione piatti del menu selezionato */}
      <Dialog open={!!itemsMenu} onClose={closeItemsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Piatti di "{itemsMenu?.name}"</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-4">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openCreateItem}
              className="self-start border-ink/20 text-ink-soft normal-case"
            >
              Aggiungi piatto al menu
            </Button>

            {itemsMenu && itemsMenu.items.length === 0 && <p className="text-clay">Nessun piatto in questo menu ancora.</p>}

            {itemsMenu && itemsMenu.items.length > 0 && (
              <ReorderableList
                items={itemsMenu.items}
                onReorder={handleReorderItems}
                renderItem={(item) => (
                  <div className="rounded-lg border border-black/10 p-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt="" className="h-11 w-11 rounded-md object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold">{item.name}</p>
                          {item.category && <Chip label={item.category} size="small" />}
                        </div>
                        <p className="text-[0.85rem] font-semibold text-gold-600">{formatPrice(item.price)}</p>
                      </div>
                      <IconButton size="small" onClick={() => openEditItem(item)} aria-label="Modifica piatto">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteItemTarget(item)} aria-label="Elimina piatto">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeItemsDialog} className="normal-case">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: crea/modifica singolo piatto del menu */}
      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItemId ? 'Modifica piatto' : 'Nuovo piatto nel menu'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
            {!editingItemId && dishes.length > 0 && (
              <>
                <TextField
                  select
                  label="Precompila da un piatto del catalogo (opzionale)"
                  fullWidth
                  value={prefillDishId}
                  onChange={(e) => handlePrefillFromDish(e.target.value === '' ? '' : Number(e.target.value))}
                  helperText="Scegli un piatto esistente per copiarne nome, categoria, descrizione e immagine, poi imposta il prezzo per questo menu."
                >
                  <SelectMenuItem value="">— Nessuno, piatto nuovo —</SelectMenuItem>
                  {dishes.map((dish) => (
                    <SelectMenuItem key={dish.id} value={dish.id}>
                      {dish.name}
                    </SelectMenuItem>
                  ))}
                </TextField>
                <Divider />
              </>
            )}
            <TextField
              label="Nome"
              fullWidth
              value={itemForm.name}
              onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <TextField
              select
              label="Categoria"
              fullWidth
              value={itemForm.category ?? ''}
              onChange={(e) => setItemForm((p) => ({ ...p, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <SelectMenuItem key={c.value} value={c.value}>
                  {c.label}
                </SelectMenuItem>
              ))}
            </TextField>
            <TextField
              label="Descrizione"
              fullWidth
              multiline
              minRows={2}
              value={itemForm.description ?? ''}
              onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))}
            />
            <ImageUploadField
              label="Immagine"
              value={itemForm.imageUrl ?? null}
              onChange={(url) => setItemForm((p) => ({ ...p, imageUrl: url }))}
            />
            <TextField
              label="Prezzo nel menu"
              type="number"
              fullWidth
              value={itemForm.price}
              onChange={(e) => setItemForm((p) => ({ ...p, price: Number(e.target.value) }))}
              InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
              inputProps={{ min: 0, step: 0.5 }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialogOpen(false)} disabled={savingItem} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            disabled={savingItem || !itemForm.name || itemForm.price < 0}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {savingItem ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteItemTarget}
        itemLabel={deleteItemTarget?.name ?? ''}
        onCancel={() => setDeleteItemTarget(null)}
        onConfirm={handleDeleteItem}
        loading={deletingItem}
      />
    </div>
  )
}
