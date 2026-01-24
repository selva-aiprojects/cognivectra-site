# Quick Image Reference Table

| Page | Current File | Location | Dimensions | Theme | Priority |
|------|-------------|----------|------------|-------|----------|
| **Home** | `src/assets/home-hero-automation.png` | Hero right side | 7680×4320 (8K) | Tech automation, cloud infrastructure | HIGH |
| **Services** | `public/hero_tech_services.png` | Hero right side | 7680×4320 (8K) | Cloud services, microservices | HIGH |
| **Engagements** | `public/hero_engagements.png` | Hero right side | 7680×4320 (8K) | Business partnership, collaboration | HIGH |
| **Who We Are** | `public/hero_engagements.png` (reused) | Hero right side | 7680×4320 (8K) | Mission, vision, innovation | HIGH |
| **Results** | `public/hero_results.png` | Hero right side | 7680×4320 (8K) | Analytics, success metrics | HIGH |
| **Mission** | `src/assets/mission-vision.png` | Hero right side | 7680×4320 (8K) | Mission, vision, empowerment | HIGH |
| **Industries** | `public/hero_tech_services.png` (reused) | Hero right side | 7680×4320 (8K) | Industry solutions | MEDIUM |
| **About** | `src/assets/illustrations/about-expertise.svg` | Hero right side | 7680×4320 (8K) | Platform engineering, expertise | MEDIUM |


## Key Requirements for ALL Images:
- ❌ **NO TEXT** on images
- ❌ **NO LABELS** or overlays
- ✅ Professional, business-relevant imagery
- ✅ Modern aesthetic (blues, purples, teals)
- ✅ High resolution (minimum 4K, ideal 8K)
- ✅ WebP format recommended (smaller file size)
- ✅ File size: 2-10 MB per image

## CSS Optimizations Applied:
✅ Global image quality optimization
✅ Hardware acceleration enabled
✅ Crisp rendering on retina displays
✅ Smooth hover transitions
✅ No compression artifacts

## Recommended Workflow:
1. Visit Unsplash.com or Pexels.com
2. Search using keywords from main guide
3. Download highest resolution available
4. Convert to WebP using online tool or ImageMagick
5. Replace files in project
6. Test on localhost
7. Deploy to production

## Quick Commands:

### Convert PNG to WebP (if you have ImageMagick):
```bash
magick convert input.png -quality 85 output.webp
```

### Optimize existing images:
```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Resize and optimize
sharp -i input.png -o output.webp --width 3840 --quality 85
```

---

*See IMAGE_REPLACEMENT_GUIDE.md for full details*
