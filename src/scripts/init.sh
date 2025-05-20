#!/bin/sh

header="date,position,song,artist,popularity,duration_ms,album_type,total_tracks,release_date,is_explicit"
output_dir="../data/playlists"

if [ -d "$output_dir" ]; then
    echo "The folder $output_dir exists."
    exit 1
else
    mkdir -p "$output_dir"
    echo "Folder $output_dir created."
fi

while IFS= read -r country || [ -n "$country" ]; do
    filename=$(echo "$country" | tr '[:upper:]' '[:lower:]' | sed 's/ /_/g')
    filepath="$output_dir/top_50_${filename}.csv"

    echo "$header" > "$filepath"
    echo "$filepath Created"
done < "countries.txt"

echo "All files are created."