document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#4361ee" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#4361ee", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Add animation to the active tab content
            const activeContent = document.getElementById(tabId);
            activeContent.classList.add('animate__animated', 'animate__fadeIn');
            setTimeout(() => {
                activeContent.classList.remove('animate__animated', 'animate__fadeIn');
            }, 1000);
        });
    });
    
    // File loading for encode
    setupFileInput('encode-load-btn', 'encode-file', 'encode-text', 'encode-input-type');
    setupFileInput('encode-key-load-btn', 'encode-key-file', 'encode-key', 'encode-key-type');
    setupFileInput('decode-load-btn', 'decode-file', 'decode-pool', 'decode-input-type');
    setupFileInput('decode-key-load-btn', 'decode-key-file', 'decode-key', 'decode-key-type');
    setupFileInput('decode-primes-load-btn', 'decode-primes-file', 'decode-primes', 'decode-primes-type');
    
    function setupFileInput(btnId, fileInputId, targetId, radioName) {
        const btn = document.getElementById(btnId);
        const fileInput = document.getElementById(fileInputId);
        const target = document.getElementById(targetId);
        
        btn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    target.value = event.target.result;
                    document.querySelector(`input[name="${radioName}"][value="file"]`).checked = true;
                    showStatus(`File "${file.name}" loaded successfully`, 'success');
                };
                reader.onerror = () => {
                    showStatus(`Error reading file "${file.name}"`, 'error');
                };
                reader.readAsText(file);
            }
        });
    }
    
    // Clear buttons
    document.getElementById('clear-encode-btn').addEventListener('click', () => {
        document.getElementById('encode-text').value = '';
        document.getElementById('encode-key').value = '';
        document.getElementById('encode-number-conversion').value = '';
        document.getElementById('encode-nshift').value = '';
        document.getElementById('encode-primes').value = '';
        document.getElementById('encode-pool').value = '';
        document.querySelector('input[name="encode-input-type"][value="text"]').checked = true;
        document.querySelector('input[name="encode-key-type"][value="text"]').checked = true;
        showStatus('Encode inputs cleared', 'success');
    });
    
    document.getElementById('clear-decode-btn').addEventListener('click', () => {
        document.getElementById('decode-pool').value = '';
        document.getElementById('decode-key').value = '';
        document.getElementById('decode-primes').value = '';
        document.getElementById('decode-scatterpool').value = '';
        document.getElementById('decode-final').value = '';
        document.querySelector('input[name="decode-input-type"][value="file"]').checked = true;
        document.querySelector('input[name="decode-key-type"][value="text"]').checked = true;
        document.querySelector('input[name="decode-primes-type"][value="file"]').checked = true;
        showStatus('Decode inputs cleared', 'success');
    });
    
    // Save buttons
    document.getElementById('save-pool-btn').addEventListener('click', () => {
        saveToFile('pool.txt', document.getElementById('encode-pool').value);
    });
    
    document.getElementById('save-primes-btn').addEventListener('click', () => {
        saveToFile('primes.txt', document.getElementById('encode-primes').value);
    });
    
    document.getElementById('save-all-encode-btn').addEventListener('click', () => {
        const poolContent = document.getElementById('encode-pool').value;
        const primesContent = document.getElementById('encode-primes').value;
        
        if (poolContent && primesContent) {
            const zip = new JSZip();
            zip.file("pool.txt", poolContent);
            zip.file("primes.txt", primesContent);
            
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    saveAs(content, "nscatterpool_encoded.zip");
                    showStatus('All encode outputs saved as ZIP', 'success');
                });
        } else {
            showStatus('No content to save', 'error');
        }
    });
    
    document.getElementById('save-decoded-btn').addEventListener('click', () => {
        saveToFile('decoded.txt', document.getElementById('decode-final').value);
    });
    
    document.getElementById('save-all-decode-btn').addEventListener('click', () => {
        const scatterpoolContent = document.getElementById('decode-scatterpool').value;
        const finalContent = document.getElementById('decode-final').value;
        
        if (scatterpoolContent && finalContent) {
            const zip = new JSZip();
            zip.file("scatterpool_decoded.txt", scatterpoolContent);
            zip.file("final_decoded.txt", finalContent);
            
            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    saveAs(content, "nscatterpool_decoded.zip");
                    showStatus('All decode outputs saved as ZIP', 'success');
                });
        } else {
            showStatus('No content to save', 'error');
        }
    });
    
    // Helper function to show status messages
    function showStatus(message, type) {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = 'status show ' + type;
        
        // Clear status after 5 seconds
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }
    
    // Helper function to save content to file
    function saveToFile(filename, content) {
        if (!content) {
            showStatus('No content to save', 'error');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatus(`Saved to ${filename}`, 'success');
    }
    
    // ========== Cipher Implementation ==========
    
    // --- Functions for Number to Word Conversion ---
    function convertNumbersToWords(text) {
        const _ONES = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
                     "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
                     "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
        const _TENS = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

        function _numberToWordTwoDigits(numStr) {
            const num = parseInt(numStr, 10);
            if (num < 20) {
                return _ONES[num];
            } else {
                const tens = _TENS[Math.floor(num / 10)];
                const ones = _ONES[num % 10];
                return (tens + " " + ones).trim();
            }
        }

        let parts = [];
        let current_number = "";
        
        for (let char of text) {
            if (/\d/.test(char)) {
                current_number += char;
            } else {
                if (current_number) {
                    if (current_number.length <= 2) {
                        parts.push(_numberToWordTwoDigits(current_number));
                    } else {
                        for (let digit of current_number) {
                            parts.push(_ONES[parseInt(digit, 10)]);
                        }
                    }
                    current_number = "";
                }
                parts.push(char);
            }
        }
        
        if (current_number) {
            if (current_number.length <= 2) {
                parts.push(_numberToWordTwoDigits(current_number));
            } else {
                for (let digit of current_number) {
                    parts.push(_ONES[parseInt(digit, 10)]);
                }
            }
        }

        return parts.join('');
    }

    // --- N-Shift Cipher Functions ---
    function nsLetterToNum(letter) {
        letter = letter.toUpperCase();
        if (letter.includes("'")) {
            const baseChar = letter[0];
            if (!'ABCD'.includes(baseChar)) {
                return 0;
            }
            return (baseChar.charCodeAt(0) - 'A'.charCodeAt(0) + 1) + 26;
        }
        return letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    }

    function nsNumToLetter(num, includePrime=false) {
        if (num === 0 || num > 30) {
            return '?';
        }
        if (num <= 26) {
            return String.fromCharCode(num + 'A'.charCodeAt(0) - 1);
        } else {
            const baseNum = num - 26;
            return String.fromCharCode(baseNum + 'A'.charCodeAt(0) - 1) + (includePrime ? "'" : "");
        }
    }

    function nsApplyShifts(binary, shift) {
        if (shift > 5) {
            shift = shift - 5;
        } else if (shift === 5) {
            return binary.split('').reverse().join('');
        }
        
        return binary.slice(-shift) + binary.slice(0, -shift);
    }

    function nsDistributeKey(keyDigits, textLength) {
        if (!keyDigits || keyDigits.length === 0) {
            throw new Error("Key cannot be empty");
        }
        
        const keyLen = keyDigits.length;
        if (keyLen <= textLength) {
            return Array.from({length: textLength}, (_, i) => [keyDigits[i % keyLen]]);
        }
        
        const baseShifts = Math.floor(keyLen / textLength);
        const extra = keyLen % textLength;
        const distribution = [];
        let keyPos = 0;
        
        for (let i = 0; i < textLength; i++) {
            const shiftsNeeded = baseShifts + (i < extra ? 1 : 0);
            distribution.push(keyDigits.slice(keyPos, keyPos + shiftsNeeded));
            keyPos += shiftsNeeded;
        }
        
        return distribution;
    }

    function nsEncode(text, key) {
        const encrypted = [];
        const primes = [];
        
        const filteredInputText = text.split('').filter(char => /[a-zA-Z]/.test(char)).join('');
        if (!filteredInputText) {
            return { encoded: "", primes: [] };
        }

        const keyDigits = key.split('').map(d => parseInt(d, 10));
        const keyDistribution = nsDistributeKey(keyDigits, filteredInputText.length);
        
        for (let i = 0; i < filteredInputText.length; i++) {
            const char = filteredInputText[i];
            const shifts = keyDistribution[i].map(d => parseInt(d, 10));
            
            const num = nsLetterToNum(char);
            if (num === 0 || num > 30) {
                continue;
            }
            
            let binary = num.toString(2).padStart(5, '0');
            
            let shifted = binary;
            for (const shift of shifts) {
                shifted = nsApplyShifts(shifted, shift);
            }
            
            const notBinary = shifted.split('').map(b => b === '0' ? '1' : '0').join('');
            const encryptedNum = parseInt(notBinary, 2);
            
            if (encryptedNum === 0 || encryptedNum > 30) {
                continue;
            }
            
            if (encryptedNum > 26) {
                primes.push(i + 1);
                encrypted.push(nsNumToLetter(encryptedNum - 26, true));
            } else {
                encrypted.push(nsNumToLetter(encryptedNum));
            }
        }
        
        return { encoded: encrypted.join(''), primes };
    }

    function nsDecode(text, key, primes) {
        const decrypted = [];
        const primesSet = new Set(primes.map(p => parseInt(p, 10)));
        
        const filteredDecodeInput = [];
        for (const char of text) {
            if (/[a-zA-Z']/.test(char)) {
                filteredDecodeInput.push(char);
            }
        }
        
        if (filteredDecodeInput.length === 0) {
            return "";
        }

        const keyDigits = key.split('').map(d => parseInt(d, 10));
        const keyDistribution = nsDistributeKey(keyDigits, filteredDecodeInput.length);
        
        for (let i = 0; i < filteredDecodeInput.length; i++) {
            const charCurrent = filteredDecodeInput[i];
            const isPrimed = primesSet.has(i + 1);
            
            let letterForNumConversion = charCurrent;
            if (isPrimed && charCurrent.length === 1 && /[a-zA-Z]/.test(charCurrent)) {
                letterForNumConversion += "'";
            } else if (!isPrimed && charCurrent.includes("'")) {
                letterForNumConversion = charCurrent.replace("'", "");
            }

            const num = nsLetterToNum(letterForNumConversion);
            if (num === 0 || num > 30) {
                continue;
            }
            
            let binary = num.toString(2).padStart(5, '0');
            
            const notBinary = binary.split('').map(b => b === '0' ? '1' : '0').join('');
            
            const shifts = keyDistribution[i].map(d => parseInt(d, 10));
            
            let shiftedBack = notBinary;
            for (let j = shifts.length - 1; j >= 0; j--) {
                const shift = shifts[j];
                if (shift > 5) {
                    const adjustedShift = shift - 5;
                    const leftShift = 5 - adjustedShift;
                    shiftedBack = shiftedBack.slice(-leftShift) + shiftedBack.slice(0, -leftShift);
                } else if (shift === 5) {
                    shiftedBack = shiftedBack.split('').reverse().join('');
                } else {
                    const leftShift = 5 - shift;
                    shiftedBack = shiftedBack.slice(-leftShift) + shiftedBack.slice(0, -leftShift);
                }
            }
            
            const decryptedNum = parseInt(shiftedBack, 2);
            if (decryptedNum === 0 || decryptedNum > 30) {
                continue;
            }
            
            decrypted.push(nsNumToLetter(decryptedNum));
        }
        
        return decrypted.join('');
    }

    // --- Scatter Pool Functions ---
    function spLetterToNum(letter) {
        letter = letter.toUpperCase();
        return letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    }

    function spNumToLetter(num) {
        if (num === 0) {
            return 'Z';
        }
        return String.fromCharCode((num - 1) % 26 + 'A'.charCodeAt(0));
    }

    function spGeneratePool(size) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < size; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function spSplitKey(key, segments) {
        if (!key || segments <= 0) {
            return Array(segments).fill('0');
        }
        
        const cleanKey = key.toString().split('').filter(c => /\d/.test(c)).join('');
        if (!cleanKey) {
            return Array(segments).fill('0');
        }
        
        const segmentSize = Math.ceil(cleanKey.length / segments);
        return Array.from({length: segments}, (_, i) => 
            cleanKey.slice(i * segmentSize, (i + 1) * segmentSize) || '0'
        );
    }

    function spCalculatePositions(textChars, key, poolSize) {
        if (!textChars || textChars.length === 0 || poolSize <= 0) {
            return [];
        }
        
        const segments = spSplitKey(key, textChars.length);
        const positions = [];
        let currentPos = 0;
        const minGap = 15;
        
        for (const segment of segments) {
            let gap;
            try {
                gap = Math.max(minGap, parseInt(segment, 10) % 75 + 1);
            } catch (e) {
                gap = minGap;
            }
            
            currentPos += gap;
            const pos = currentPos % (poolSize - 3);
            positions.push(pos);
        }
        
        return positions;
    }

    function spEncodeText(text, key) {
        const filteredText = text.toUpperCase().split('').filter(char => /[A-Z]/.test(char)).join('');
        
        if (!filteredText) {
            console.log("No alphabetic characters to encode in Scatter Pool.");
            return null;
        }
        
        let poolSize = Math.max(filteredText.length * 250, 5000);
        const maxAttempts = 15;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let pool = spGeneratePool(poolSize).split('');
            const positions = spCalculatePositions(filteredText, key, pool.length);
            
            if (positions.length !== filteredText.length) {
                console.log(`Warning: Number of positions (${positions.length}) does not match filtered text length (${filteredText.length}). Retrying with larger pool.`);
                poolSize = Math.floor(poolSize * 1.25);
                continue;
            }

            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];
                const char = filteredText[i];
                
                let adjustedPos = pos;
                if (pos + 2 >= pool.length) {
                    adjustedPos = pool.length - 3;
                }
                
                pool[adjustedPos] = char;
                pool[adjustedPos + 1] = (i % 10).toString();
                pool[adjustedPos + 2] = spNumToLetter((spLetterToNum(char) + adjustedPos) % 26);
            }
            
            const decoded = spDecodePool(pool.join(''), key, true);
            if (decoded === filteredText) {
                console.log(`Scatter Pool Encoding verified successfully after ${attempt + 1} attempt(s)`);
                return pool.join('');
            }
            
            console.log(`Scatter Pool Verification failed (attempt ${attempt + 1}). Increasing pool size.`);
            poolSize = Math.floor(poolSize * 1.5);
        }
        
        console.log("Failed to create valid Scatter Pool encoding after maximum attempts");
        return null;
    }

    function spDecodePool(pool, key, verifyOnly=false) {
        if (!pool || !key) {
            return "";
        }
        
        const candidates = [];
        for (let i = 0; i < pool.length - 2; i++) {
            if (/[A-Z]/.test(pool[i]) && /\d/.test(pool[i+1]) && /[A-Z]/.test(pool[i+2])) {
                candidates.push({
                    pos: i,
                    char: pool[i],
                    posDigit: parseInt(pool[i+1], 10),
                    checksum: pool[i+2]
                });
            }
        }
        
        if (candidates.length === 0) {
            return "";
        }
        
        candidates.sort((a, b) => a.pos - b.pos);
        
        const placeholderTextChars = Array(candidates.length).fill('A');
        const expectedPositions = spCalculatePositions(placeholderTextChars, key, pool.length);
        
        const decodedCharsMap = {};
        const matchedExpectedIndices = Array(expectedPositions.length).fill(false);
        
        for (const candidate of candidates) {
            let bestMatchIdx = -1;
            let minDiff = Infinity;
            
            for (let i = 0; i < expectedPositions.length; i++) {
                if (!matchedExpectedIndices[i]) {
                    const diff = Math.abs(candidate.pos - expectedPositions[i]);
                    if (diff <= 10 && diff < minDiff) {
                        bestMatchIdx = i;
                        minDiff = diff;
                    }
                }
            }
            
            if (bestMatchIdx === -1) {
                continue;
            }
            
            if (candidate.posDigit !== bestMatchIdx % 10) {
                continue;
            }
            
            const expectedChecksum = spNumToLetter((spLetterToNum(candidate.char) + candidate.pos) % 26);
            if (candidate.checksum !== expectedChecksum) {
                continue;
            }
            
            matchedExpectedIndices[bestMatchIdx] = true;
            decodedCharsMap[bestMatchIdx] = candidate.char;
        }
        
        const finalDecodedList = [];
        for (let i = 0; i < expectedPositions.length; i++) {
            if (decodedCharsMap[i]) {
                finalDecodedList.push(decodedCharsMap[i]);
            }
        }
        
        return finalDecodedList.join('');
    }

    // Encoding process
    document.getElementById('encode-btn').addEventListener('click', async function() {
        const text = document.getElementById('encode-text').value;
        const key = document.getElementById('encode-key').value;
        
        if (!text) {
            showStatus('Please enter text to encode', 'error');
            return;
        }
        
        if (!key || !/^\d+$/.test(key)) {
            showStatus('Key must contain only digits', 'error');
            return;
        }
        
        try {
            // Add loading animation
            const encodeBtn = document.getElementById('encode-btn');
            encodeBtn.classList.remove('animate__pulse', 'animate__infinite');
            encodeBtn.innerHTML = '<span class="loader"></span> Encoding...';
            
            // Simulate processing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Step 1: Convert numbers to words
            const textWithWords = convertNumbersToWords(text);
            document.getElementById('encode-number-conversion').value = textWithWords;
            
            // Step 2: N-Shift encoding
            const nShiftResult = nsEncode(textWithWords, key);
            document.getElementById('encode-nshift').value = nShiftResult.encoded;
            document.getElementById('encode-primes').value = nShiftResult.primes.join(' ');
            
            // Step 3: Scatter Pool encoding
            const poolContent = spEncodeText(nShiftResult.encoded, key);
            document.getElementById('encode-pool').value = poolContent;
            
            showStatus('Encoding completed successfully!', 'success');
            
            // Scroll to output section
            document.querySelector('.output-card').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            showStatus(`Encoding failed: ${error.message}`, 'error');
            console.error(error);
        } finally {
            // Restore button state
            const encodeBtn = document.getElementById('encode-btn');
            encodeBtn.innerHTML = 'Encode';
            encodeBtn.classList.add('animate__pulse', 'animate__infinite');
        }
    });
    
    // Decoding process
    document.getElementById('decode-btn').addEventListener('click', async function() {
        const poolContent = document.getElementById('decode-pool').value;
        const key = document.getElementById('decode-key').value;
        const primesText = document.getElementById('decode-primes').value;
        
        if (!poolContent) {
            showStatus('Please enter pool content', 'error');
            return;
        }
        
        if (!key || !/^\d+$/.test(key)) {
            showStatus('Key must contain only digits', 'error');
            return;
        }
        
        if (!primesText) {
            showStatus('Please enter prime positions', 'error');
            return;
        }
        
        const primes = primesText.trim().split(/\s+/).map(p => parseInt(p, 10));
        
        try {
            // Add loading animation
            const decodeBtn = document.getElementById('decode-btn');
            decodeBtn.classList.remove('animate__pulse', 'animate__infinite');
            decodeBtn.innerHTML = '<span class="loader"></span> Decoding...';
            
            // Simulate processing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Step 1: Scatter Pool decoding
            const scatterPoolDecoded = spDecodePool(poolContent, key);
            document.getElementById('decode-scatterpool').value = scatterPoolDecoded;
            
            // Step 2: N-Shift decoding
            const finalDecoded = nsDecode(scatterPoolDecoded, key, primes);
            document.getElementById('decode-final').value = finalDecoded;
            
            showStatus('Decoding completed successfully!', 'success');
            
            // Scroll to output section
            document.querySelector('.output-card').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            showStatus(`Decoding failed: ${error.message}`, 'error');
            console.error(error);
        } finally {
            // Restore button state
            const decodeBtn = document.getElementById('decode-btn');
            decodeBtn.innerHTML = 'Decode';
            decodeBtn.classList.add('animate__pulse', 'animate__infinite');
        }
    });
    
    // Add loader CSS
    const style = document.createElement('style');
    style.textContent = `
        .loader {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 3px solid white;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Load JSZip library for ZIP functionality
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = function() {
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
        document.head.appendChild(script2);
    };
    document.head.appendChild(script);
});