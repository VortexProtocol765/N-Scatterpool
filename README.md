N-Scatter Pool Cipher
A modern cryptographic tool that combines N-Shift cipher with a scatter pool technique for secure message encoding and decoding.

Features
Two-step Encoding Process:

N-Shift cipher encryption

Scatter Pool distribution for enhanced security

Number Conversion: Automatically converts numbers in text to their word equivalents

File Handling: Load inputs from files or type directly

Output Management: Save results as individual files or bundled ZIP archives

Responsive Design: Works on both desktop and mobile devices

Visual Effects: Interactive particle background and smooth animations

Usage
Encoding Process
Input Text:

Type your message or load from a file

Numbers in text are automatically converted to words (e.g., "123" → "ONE TWO THREE")

Universal Key:

Enter a numeric key (digits only) or load from file

This key is used for both N-Shift and Scatter Pool steps

Encoding Steps:

Number conversion

N-Shift cipher application

Prime positions generation

Scatter Pool distribution

Output:

Encoded pool (large random-looking text)

Prime positions (needed for decoding)

Option to save pool.txt, primes.txt, or both as ZIP

Decoding Process
Pool Content:

Paste encoded pool or load from pool.txt file

Universal Key:

Enter the same numeric key used for encoding

Prime Positions:

Provide the prime positions (space-separated numbers) or load from primes.txt

Decoding Steps:

Scatter Pool decoding

N-Shift cipher reversal

Output:

Recovered original message

Option to save decoded text

Technical Implementation
N-Shift Cipher:

Converts letters to 5-bit binary representations

Applies bit shifts based on key digits

Uses prime notation for values above 26 (A'=27, B'=28, etc.)

Scatter Pool:

Creates a large random character pool (minimum 5000 chars)

Distributes message characters with checksums and position markers

Automatically verifies encoding can be decoded

Requirements
Modern web browser (Chrome, Firefox, Safari, Edge)

Internet connection (for loading external libraries)

Installation
No installation needed - simply open the HTML file in a browser.

Libraries Used
particles.js for background animation

JSZip for ZIP file creation

FileSaver.js for file downloads

Animate.css for UI animations

Security Notes
All processing happens client-side (no server communication)

The strength depends on keeping the key secret

For real security, use with other encryption methods