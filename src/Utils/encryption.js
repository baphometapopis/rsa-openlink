import CryptoJS from 'crypto-js';

// Encryption function
const key ='fc5c858f99cb5539bddf95af6ec1eb16'
const iv = 'fq5W1PgtauSYYTbZ' 

// Encryption function
export function encryptAESCBC256(plaintext) {
    // Ensure the key is 32 bytes (256 bits)
    // if (key.length !== 64) {
    //     throw new Error('Key must be 32 bytes (256 bits) long in hex');
    // }

    // // Ensure the IV is 16 bytes
    // if (iv.length !== 32) {
    //     throw new Error('IV must be 16 bytes long in hex');
    // }

    // Encrypt the plaintext
    const encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Hex.parse(key), {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Return the ciphertext in Base64 format
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

// Decryption function
export function decryptAESCBC256(ciphertext) {
    // Ensure the key is 32 bytes (256 bits)
    // if (key?.length !== 64) {
    //     throw new Error('Key must be 32 bytes (256 bits) long in hex');
    // }

    // // Ensure the IV is 16 bytes
    // if (iv.length !== 32) {
    //     throw new Error('IV must be 16 bytes long in hex');
    // }

    // Decrypt the ciphertext
    const decrypted = CryptoJS.AES.decrypt(
        {
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        },
        CryptoJS.enc.Hex.parse(key),
        {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );
console.log(decrypted)
    // Return the decrypted plaintext as a string
    return decrypted.toString(CryptoJS?.enc?.Utf8);
}

