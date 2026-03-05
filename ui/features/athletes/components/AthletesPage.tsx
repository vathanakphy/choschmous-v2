'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, Pencil, Trash2, Upload, User } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import { Badge } from '@/ui/design-system/primitives/Badge';
import { Button } from '@/ui/design-system/primitives/Button';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/ui/design-system/primitives/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/ui/design-system/primitives/dialog';
import { Label } from '@/ui/design-system/primitives/label';
import { apiClient } from '@/lib/api/client';
import type { AthleteEnriched } from '@/domains/athletes';

export function AthletesPage() {
    const searchParams = useSearchParams();
    const sportId = searchParams?.get('sport');
    const extraParams = useMemo(
        () => (sportId ? { sport: sportId } : undefined),
        [sportId]
    );
    const list = usePagedList<AthleteEnriched>(ROUTES.API.ATHLETES, { extraParams });

    // Get sport name from the first athlete's sports data if filtering by sport
    const sportName = sportId && list.data && list.data.length > 0
        ? list.data[0].sports?.find(s => s.id === parseInt(sportId))?.name ?? null
        : null;

    // Dialog states
    const [detailTarget, setDetailTarget] = useState<AthleteEnriched | null>(null);
    const [editTarget, setEditTarget] = useState<AthleteEnriched | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AthleteEnriched | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    // Form state
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [form, setForm] = useState({
        kh_family_name: '',
        kh_given_name: '',
        en_family_name: '',
        en_given_name: '',
        phonenumber: '',
        gender: '',
        date_of_birth: '',
        id_document_type: '',
        address: '',
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPhotoPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const openEdit = (athlete: AthleteEnriched) => {
        setEditTarget(athlete);
        setForm({
            kh_family_name: athlete.enrollment?.kh_family_name || '',
            kh_given_name: athlete.enrollment?.kh_given_name || '',
            en_family_name: athlete.enrollment?.en_family_name || '',
            en_given_name: athlete.enrollment?.en_given_name || '',
            phonenumber: athlete.enrollment?.phonenumber || '',
            gender: athlete.enrollment?.gender || '',
            date_of_birth: athlete.enrollment?.date_of_birth || '',
            id_document_type: athlete.enrollment?.id_document_type || '',
            address: athlete.enrollment?.address || '',
        });
        setPhotoFile(null);
        setPhotoPreview(athlete.photoUrl || null);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editTarget) return;
        setEditing(true);

        try {
            const updateData: any = {
                kh_family_name: form.kh_family_name,
                kh_given_name: form.kh_given_name,
                en_family_name: form.en_family_name,
                en_given_name: form.en_given_name,
                phonenumber: form.phonenumber,
                gender: form.gender,
                date_of_birth: form.date_of_birth,
                id_document_type: form.id_document_type,
                address: form.address,
            };

            // If photo file was selected, we'd need to handle upload
            // For now, just update the fields
            if (photoFile) {
                // In a real implementation, you'd upload the file and get the URL
                // updateData.photo_path = uploadedUrl;
            }

            await apiClient.patch(`/api/athletes/${editTarget.enroll_id}`, updateData);
            setEditDialogOpen(false);
            setEditTarget(null);
            list.reload();
        } finally {
            setEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            await apiClient.delete(`/api/athletes/${deleteTarget.id}`);
            setDeleteTarget(null);
            list.reload();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const fmtDate = (d: string) =>
        d
            ? new Date(d).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—';

    return (
        <div className="space-y-6">
            <PageHeader
                title={sportName ? `កីឡាករ - ${sportName}` : "បញ្ជីឈ្មោះកីឡាករ"}
                subtitle={sportName ? `គ្រប់គ្រងកីឡាករឯកទម្ងន់ ${sportName}` : "គ្រប់គ្រងព័ត៌មានលម្អិតលម្អិតនៃកីឡាករ"}
            />

            {list.error && (
                <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
                    <p className="text-destructive text-sm">{list.error}</p>
                </div>
            )}

            {list.isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            ) : !list.data || list.data.length === 0 ? (
                <EmptyState
                    icon={<Eye className="h-12 w-12" />}
                    title="មិនមានកីឡាករ"
                    description="មិនមានឯកសារកីឡាករនៅឡើយ"
                />
            ) : (
                <div className="bg-card rounded-2xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead className="w-16">រូប</TableHead>
                                <TableHead>ឈ្មោះ</TableHead>
                                <TableHead>ភេទ</TableHead>
                                <TableHead>ថ្ងៃកំណើត</TableHead>
                                <TableHead>ទូរស័ព្ទ</TableHead>
                                <TableHead>អាសយដ្ឋាន</TableHead>
                                <TableHead>កីឡា</TableHead>
                                <TableHead>ស្ថាប័ន</TableHead>
                                <TableHead className="text-right">សកម្មភាព</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data && list.data.map((athlete, idx) => (
                                <TableRow key={athlete.id}>
                                    <TableCell className="text-muted-foreground">
                                        {(list.page - 1) * list.pageSize + idx + 1}
                                    </TableCell>
                                    <TableCell>
                                        {athlete.photoUrl ? (
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={athlete.photoUrl}
                                                    alt={athlete.fullName}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        const parent = (e.target as HTMLImageElement).parentElement;
                                                        if (parent) {
                                                            const icon = document.createElement('div');
                                                            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                                                            parent.appendChild(icon);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {athlete.fullName || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {athlete.sports && athlete.sports.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {athlete.sports.map((sport) => (
                                                    <Badge key={sport.id} variant="secondary" className="text-xs">
                                                        {sport.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {athlete.organizations && athlete.organizations.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {athlete.organizations.map((org) => (
                                                    <Badge key={org.id} variant="outline" className="text-xs">
                                                        {org.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {athlete.enrollment?.gender || '—'}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {athlete.enrollment?.date_of_birth ? fmtDate(athlete.enrollment.date_of_birth) : '—'}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {athlete.enrollment?.phonenumber || '—'}
                                    </TableCell>
                                    <TableCell className="text-sm max-w-xs truncate">
                                        {athlete.enrollment?.address || '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => setDetailTarget(athlete)}
                                                title="មើលលម្អិត"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => openEdit(athlete)}
                                                title="កែសម្រួល"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => setDeleteTarget(athlete)}
                                                title="លុប"
                                            >
                                                <Trash2 className="text-destructive h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="px-4 pb-4">
                        <PaginationBar
                            page={list.page}
                            totalPages={list.totalPages}
                            total={list.total}
                            pageSize={list.pageSize}
                            onPageChange={list.setPage}
                        />
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
            <Dialog open={!!detailTarget} onOpenChange={() => setDetailTarget(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>ព័ត៌មានលម្អិតលម្អិត</DialogTitle>
                    </DialogHeader>
                    {detailTarget && (
                        <div className="space-y-6 py-4">
                            {/* Profile Picture */}
                            <div className="flex justify-center">
                                {detailTarget.photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={detailTarget.photoUrl}
                                        alt={detailTarget.fullName}
                                        className="h-48 w-48 rounded-lg object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`h-48 w-48 rounded-lg bg-muted flex items-center justify-center ${detailTarget.photoUrl ? 'hidden' : ''
                                        }`}
                                    style={{ display: detailTarget.photoUrl ? 'none' : 'flex' }}
                                >
                                    <User className="h-24 w-24 text-muted-foreground" />
                                </div>
                            </div>

                            {detailTarget.enrollment && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">ឈ្មោះខ្មែរ</p>
                                        <p className="font-medium">
                                            {detailTarget.enrollment.kh_family_name}{' '}
                                            {detailTarget.enrollment.kh_given_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ឈ្មោះអង់គ្លេស</p>
                                        <p className="font-medium">
                                            {detailTarget.enrollment.en_family_name}{' '}
                                            {detailTarget.enrollment.en_given_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ទូរស័ព្ទ</p>
                                        <p className="font-medium">{detailTarget.enrollment.phonenumber || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ភេទ</p>
                                        <p className="font-medium">{detailTarget.enrollment.gender || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ថ្ងៃខែឆ្នាំកំណើត</p>
                                        <p className="font-medium">
                                            {fmtDate(detailTarget.enrollment.date_of_birth)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ប្រភេទឯកសារ</p>
                                        <p className="font-medium">{detailTarget.enrollment.id_document_type || '—'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground">អាសយដ្ឋាន</p>
                                        <p className="font-medium">{detailTarget.enrollment.address || '—'}</p>
                                    </div>

                                    {/* Sports */}
                                    {detailTarget.sports && detailTarget.sports.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground mb-2">កីឡា</p>
                                            <div className="flex flex-wrap gap-2">
                                                {detailTarget.sports.map((sport) => (
                                                    <Badge key={sport.id} variant="secondary">
                                                        {sport.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Organizations */}
                                    {detailTarget.organizations && detailTarget.organizations.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground mb-2">ស្ថាប័ន</p>
                                            <div className="flex flex-wrap gap-2">
                                                {detailTarget.organizations.map((org) => (
                                                    <Badge key={org.id} variant="outline">
                                                        {org.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>កែសម្រួលលម្អិត</DialogTitle>
                        <DialogDescription>
                            កែសម្រួលព័ត៌មានលម្អិតលម្អិតនៃកីឡាករ
                        </DialogDescription>
                    </DialogHeader>
                    {editTarget && (
                        <div className="space-y-4 py-2">
                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <Label>រូបថត</Label>
                                {photoPreview ? (
                                    <div className="flex justify-center mb-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={photoPreview}
                                            alt="preview"
                                            className="h-24 w-24 rounded-lg object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex justify-center mb-2">
                                        <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    </div>
                                )}
                                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm">ចូលរូបថត</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Khmer Names */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>នាមត្រកូលខ្មែរ</Label>
                                    <input
                                        type="text"
                                        value={form.kh_family_name}
                                        onChange={(e) => setForm((f) => ({ ...f, kh_family_name: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>នាមលេងខ្មែរ</Label>
                                    <input
                                        type="text"
                                        value={form.kh_given_name}
                                        onChange={(e) => setForm((f) => ({ ...f, kh_given_name: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            {/* English Names */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Family Name (English)</Label>
                                    <input
                                        type="text"
                                        value={form.en_family_name}
                                        onChange={(e) => setForm((f) => ({ ...f, en_family_name: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Given Name (English)</Label>
                                    <input
                                        type="text"
                                        value={form.en_given_name}
                                        onChange={(e) => setForm((f) => ({ ...f, en_given_name: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            {/* Gender and Date of Birth */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>ភេទ</Label>
                                    <select
                                        value={form.gender}
                                        onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option value="">-- ជ្រើសរើស --</option>
                                        <option value="ប្រុស">ប្រុស</option>
                                        <option value="ស្រី">ស្រី</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>ថ្ងៃកំណើត</Label>
                                    <input
                                        type="date"
                                        value={form.date_of_birth}
                                        onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            {/* Phone and ID Document Type */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>ទូរស័ព្ទ</Label>
                                    <input
                                        type="text"
                                        value={form.phonenumber}
                                        onChange={(e) => setForm((f) => ({ ...f, phonenumber: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>ប្រភេទឯកសារ</Label>
                                    <input
                                        type="text"
                                        value={form.id_document_type}
                                        onChange={(e) => setForm((f) => ({ ...f, id_document_type: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label>អាសយដ្ឋាន</Label>
                                <textarea
                                    value={form.address}
                                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditDialogOpen(false);
                                setEditTarget(null);
                            }}
                            disabled={editing}
                        >
                            បោះបង់
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={editing}>
                            {editing ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>លុបកីឡាករ</DialogTitle>
                        <DialogDescription>
                            តើអ្នកពិតជាចង់លុបកីឡាករនេះមែនទេ? សកម្មភាពនេះមិនអាចម៉ាក់វិលវិញបានទេ។
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            បោះបង់
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            លុប
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
