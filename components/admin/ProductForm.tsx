"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard, glassStyles } from "@/components/ui/glass";
import {
  parseCommaList,
  parseDefectLines,
  parseKvLines,
  parseLineList,
  slugify,
  toDefectLines,
  toKvLines,
} from "@/components/admin/product-form-utils";

type DealType = "NONE" | "CHEAP_DEAL" | "HOT_SALE" | "CLEARANCE";
type DiscountType = "NONE" | "PERCENT" | "FIXED";
type ProductCondition = "NEW" | "UK_USED" | "NG_USED";
type ProductStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductInitial = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string;
  price: number;
  discountType: DiscountType;
  discountValue: number;
  categoryId: string;
  tags: string[];
  specs: Array<{ key: string; value: string }>;
  details: Array<{ key: string; value: string }>;
  stock: number;
  featured: boolean;
  status: ProductStatus;
  condition: ProductCondition;
  conditionNotes: string | null;
  defects: Array<{ title: string; description: string; severity?: string }>;
  dealType: DealType;
  warranty: string | null;
  accessoriesIncluded: string[];
  batteryHealth: string | null;
  images: string[];
};

export function ProductForm({
  mode,
  categories,
  initial,
}: {
  mode: "create" | "edit";
  categories: CategoryOption[];
  initial?: ProductInitial;
}) {
  const router = useRouter();
  const { notify } = useToast();

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [discountType, setDiscountType] = useState<DiscountType>(initial?.discountType ?? "NONE");
  const [discountValue, setDiscountValue] = useState(String(initial?.discountValue ?? 0));
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [specs, setSpecs] = useState(toKvLines(initial?.specs));
  const [details, setDetails] = useState(toKvLines(initial?.details));
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [status, setStatus] = useState<ProductStatus>(initial?.status ?? "PUBLISHED");
  const [condition, setCondition] = useState<ProductCondition>(initial?.condition ?? "NEW");
  const [conditionNotes, setConditionNotes] = useState(initial?.conditionNotes ?? "");
  const [defects, setDefects] = useState(toDefectLines(initial?.defects));
  const [dealType, setDealType] = useState<DealType>(initial?.dealType ?? "NONE");
  const [warranty, setWarranty] = useState(initial?.warranty ?? "");
  const [accessories, setAccessories] = useState((initial?.accessoriesIncluded ?? []).join(", "));
  const [batteryHealth, setBatteryHealth] = useState(initial?.batteryHealth ?? "");
  const [imagesInput, setImagesInput] = useState((initial?.images ?? []).join("\n"));
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);

  const previewImages = useMemo(() => parseLineList(imagesInput).slice(0, 6), [imagesInput]);

  const computedSlug = slugTouched ? slug : slugify(name);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const payload = {
      name: name.trim(),
      slug: computedSlug,
      brand: brand.trim(),
      description: description.trim(),
      price: Math.max(0, Math.round(Number(price))),
      discountType,
      discountValue: Math.max(0, Math.round(Number(discountValue))),
      categoryId,
      tags: parseCommaList(tags),
      specs: parseKvLines(specs),
      details: parseKvLines(details),
      stock: Math.max(0, Math.round(Number(stock))),
      featured,
      status,
      condition,
      conditionNotes: conditionNotes.trim(),
      defects: parseDefectLines(defects),
      dealType,
      warranty: warranty.trim(),
      accessoriesIncluded: parseCommaList(accessories),
      batteryHealth: batteryHealth.trim(),
      images: parseLineList(imagesInput),
    };

    const endpoint = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      notify(`Unable to ${mode === "create" ? "create" : "update"} product`, "error");
      setPending(false);
      return;
    }

    notify(`Product ${mode === "create" ? "created" : "updated"}`);
    setPending(false);
    router.push("/admin/products");
    router.refresh();
  }

  async function onImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/uploads/cloudinary", {
          method: "POST",
          body: formData,
        });

        const body = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !body.url) {
          notify(body.error ?? `Failed to upload ${file.name}`, "error");
          continue;
        }
        uploaded.push(body.url);
      }

      if (uploaded.length > 0) {
        setImagesInput((current) => {
          const existing = parseLineList(current);
          return [...existing, ...uploaded].join("\n");
        });
        notify(
          uploaded.length === 1
            ? "Image uploaded"
            : `${uploaded.length} images uploaded`
        );
      }
    } catch {
      notify("Image upload failed", "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <GlassCard className="p-5 md:p-6">
        <h2 className="text-xl font-semibold text-white">{mode === "create" ? "New Product" : "Edit Product"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" className={`${glassStyles.input} px-3 py-2`} />
          <input
            value={computedSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
            placeholder="Slug"
            className={`${glassStyles.input} px-3 py-2`}
          />
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" className={`${glassStyles.input} px-3 py-2`} />
          <input value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="Price (kobo)" className={`${glassStyles.input} px-3 py-2`} />
          <input value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="Stock" className={`${glassStyles.input} px-3 py-2`} />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${glassStyles.input} px-3 py-2`}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={`${glassStyles.input} px-3 py-2`}>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select value={condition} onChange={(e) => setCondition(e.target.value as ProductCondition)} className={`${glassStyles.input} px-3 py-2`}>
            <option value="NEW">New</option>
            <option value="UK_USED">UK Used</option>
            <option value="NG_USED">NG Used</option>
          </select>
          <select value={discountType} onChange={(e) => setDiscountType(e.target.value as DiscountType)} className={`${glassStyles.input} px-3 py-2`}>
            <option value="NONE">No Discount</option>
            <option value="PERCENT">Percent</option>
            <option value="FIXED">Fixed</option>
          </select>
          <input value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="Discount value" className={`${glassStyles.input} px-3 py-2`} />
          <select value={dealType} onChange={(e) => setDealType(e.target.value as DealType)} className={`${glassStyles.input} px-3 py-2`}>
            <option value="NONE">No Deal Type</option>
            <option value="HOT_SALE">Hot Sale</option>
            <option value="CHEAP_DEAL">Cheap Deal</option>
            <option value="CLEARANCE">Clearance</option>
          </select>
          <input value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="Warranty e.g 7 days" className={`${glassStyles.input} px-3 py-2`} />
          <input
            value={batteryHealth}
            onChange={(e) => setBatteryHealth(e.target.value)}
            placeholder="Battery health (optional)"
            className={`${glassStyles.input} px-3 py-2`}
          />
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured product
          </label>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Description"
          className={`mt-3 h-24 w-full ${glassStyles.input} px-3 py-2`}
        />
      </GlassCard>

      <GlassCard className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-white">Images + Extra Details</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/12 px-4 py-2 text-sm text-fuchsia-100">
            {uploading ? "Uploading..." : "Upload images"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-white/60">Files upload to Cloudinary, then URLs are saved to this product.</p>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <textarea
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            placeholder="Image URLs (one per line)"
            className={`h-24 w-full ${glassStyles.input} px-3 py-2`}
          />
          <textarea
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className={`h-24 w-full ${glassStyles.input} px-3 py-2`}
          />
          <textarea
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
            placeholder="Condition notes"
            className={`h-24 w-full ${glassStyles.input} px-3 py-2`}
          />
          <textarea
            value={accessories}
            onChange={(e) => setAccessories(e.target.value)}
            placeholder="Accessories included (comma separated)"
            className={`h-24 w-full ${glassStyles.input} px-3 py-2`}
          />
          <textarea
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            placeholder="Specs (one per line: key: value)"
            className={`h-32 w-full ${glassStyles.input} px-3 py-2`}
          />
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details (one per line: key: value)"
            className={`h-32 w-full ${glassStyles.input} px-3 py-2`}
          />
          <textarea
            value={defects}
            onChange={(e) => setDefects(e.target.value)}
            placeholder="Defects (one per line: title|description|severity)"
            className={`h-32 w-full md:col-span-2 ${glassStyles.input} px-3 py-2`}
          />
        </div>

        {previewImages.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
            {previewImages.map((image) => (
              <img key={image} src={image} alt="preview" className="h-20 w-full rounded-lg object-cover" />
            ))}
          </div>
        ) : null}
      </GlassCard>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-2 text-sm font-medium text-fuchsia-100 disabled:opacity-60"
      >
        {pending ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
      </button>
    </form>
  );
}
