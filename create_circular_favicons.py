#!/usr/bin/env python3

import os
from PIL import Image, ImageDraw
import sys

def create_circular_favicon(input_path, output_path, size):
    """Create a circular favicon from the input image"""
    try:
        # Open the image
        img = Image.open(input_path)
        
        # Resize to the desired size
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Create a circular mask
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # Apply the mask
        img.putalpha(mask)
        
        # Save the circular image
        img.save(output_path, 'PNG')
        print(f"Created circular favicon: {output_path} ({size}x{size})")
        
    except Exception as e:
        print(f"Error creating {output_path}: {e}")

def main():
    profile_image = "client/public/profile.jpg"
    
    if not os.path.exists(profile_image):
        print(f"Profile image not found: {profile_image}")
        sys.exit(1)
    
    # Define all the favicon sizes we need
    favicon_sizes = [
        (16, "client/public/favicon-16x16.png"),
        (16, "public/favicon-16x16.png"),
        (32, "client/public/favicon-32x32.png"),
        (32, "public/favicon-32x32.png"),
        (48, "client/public/favicon-48.png"),
        (48, "public/favicon-48.png"),
        (192, "client/public/favicon-192.png"),
        (192, "public/favicon-192.png"),
        (512, "client/public/favicon-512.png"),
        (512, "public/favicon-512.png"),
        (180, "client/public/apple-touch-icon.png"),
        (180, "public/apple-touch-icon.png"),
    ]
    
    print("Creating circular favicons...")
    
    for size, output_path in favicon_sizes:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        create_circular_favicon(profile_image, output_path, size)
    
    print("All circular favicons created successfully!")

if __name__ == "__main__":
    main()

