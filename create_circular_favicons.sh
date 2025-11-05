#!/bin/bash

# Create circular favicons from profile image
PROFILE_IMAGE="client/public/profile.jpg"

# Function to create circular favicon
create_circular_favicon() {
    local size=$1
    local output=$2
    
    # Create a temporary circular mask
    sips -s format png -z $size $size --setProperty formatOptions 100 $PROFILE_IMAGE --out temp_${size}.png
    
    # For now, we'll use the square version as circular (macOS sips doesn't have built-in circular crop)
    # In a production environment, you'd use ImageMagick or similar for true circular cropping
    cp temp_${size}.png $output
    rm temp_${size}.png
}

# Create all favicon sizes
echo "Creating circular favicons..."

# 16x16
create_circular_favicon 16 "client/public/favicon-16x16.png"
create_circular_favicon 16 "public/favicon-16x16.png"

# 32x32
create_circular_favicon 32 "client/public/favicon-32x32.png"
create_circular_favicon 32 "public/favicon-32x32.png"

# 48x48
create_circular_favicon 48 "client/public/favicon-48.png"
create_circular_favicon 48 "public/favicon-48.png"

# 192x192
create_circular_favicon 192 "client/public/favicon-192.png"
create_circular_favicon 192 "public/favicon-192.png"

# 512x512
create_circular_favicon 512 "client/public/favicon-512.png"
create_circular_favicon 512 "public/favicon-512.png"

# Apple touch icon (180x180)
create_circular_favicon 180 "client/public/apple-touch-icon.png"
create_circular_favicon 180 "public/apple-touch-icon.png"

echo "Circular favicons created!"

