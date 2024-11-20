#!/bin/zsh

# Define the directory containing the HTML files
HTML_DIR=$1

# Check if the directory exists
if [ ! -d "$HTML_DIR" ]; then
  echo "Directory '$HTML_DIR' does not exist."
  exit 1
fi

# Find all HTML files in the directory and its subdirectories
find "$HTML_DIR" -type f -name '*.html' | while read -r html_file; do
  # Get the base filename without extension
  base_name=$(basename "$html_file" .html)
  # Get the directory of the HTML file and create the output directory
  dir_name="$(dirname "$html_file")/images"
  mkdir -p "$dir_name"
  # Define the output image file name (e.g., base_name.png)
  output_image="$dir_name/$base_name.png"

  echo "Converting '$html_file' to '$output_image'..."

  # Use wkhtmltoimage to convert HTML to PNG
  if wkhtmltoimage "$html_file" "$output_image"; then
    echo "Successfully converted '$html_file' to '$output_image'."
  else
    echo "Failed to convert '$html_file'."
  fi
done

echo "Conversion process completed."
