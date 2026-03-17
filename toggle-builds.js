// We want to SKIP the build if it's a preview AND our toggle is OFF
const isPreview = process.env.VERCEL_ENV === 'preview';
const previewsEnabled = process.env.ENABLE_PREVIEWS === 'true';

if (isPreview && !previewsEnabled) {
  console.log("Previews are disabled. Skipping build.");
  process.exit(1); // 1 = SKIP in Vercel's world
} else {
  console.log("Proceeding with build...");
  process.exit(0); // 0 = PROCEED
}
