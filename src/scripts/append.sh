#!/bin/sh

# === PATHS ===
CSV_DIR="../data/playlists"         # External directory with csv files
ZIP_FILE="../data/spotify_playlists.zip"     # Zip with csv files to append
TMP_DIR="../data/tmp_spotify_playlists"   # Temp folder

# === CONTROLS ===
mkdir -p "$TMP_DIR"
unzip -q "$ZIP_FILE" -d "$TMP_DIR"


# === Check if the CSV directory is empty ===
for csv_file in "$CSV_DIR"/*.csv; do
    filename=$(basename "$csv_file")
    zip_csv="$TMP_DIR/$filename"

    # Merge the CSV files
    if [ -f "$zip_csv" ]; then
        echo "🔄 Merge $filename"

        # Skip the header of the zip CSV file
        tail -n +2 "$zip_csv" >> "$csv_file"
    fi
done

# === Clean ===
rm -rf "$TMP_DIR"
rm -rf "$ZIP_FILE"

# === Final message ===
echo "✅ Operazione completata."
