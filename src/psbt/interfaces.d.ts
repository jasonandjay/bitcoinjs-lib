/// <reference types="node" />
import { Network } from '../networks';
import { Transaction } from '../transaction';
import { PsbtInput, PsbtOutput } from 'bip174/src/lib/interfaces';
export interface PsbtCache {
    __NON_WITNESS_UTXO_TX_CACHE: Transaction[];
    __NON_WITNESS_UTXO_BUF_CACHE: Buffer[];
    __TX_IN_CACHE: {
        [index: string]: number;
    };
    __TX: Transaction;
    __FEE_RATE?: number;
    __FEE?: number;
    __EXTRACTED_TX?: Transaction;
    __UNSAFE_SIGN_NONSEGWIT: boolean;
}
export interface PsbtOptsOptional {
    network?: Network;
    maximumFeeRate?: number;
}
export interface PsbtOpts {
    network: Network;
    maximumFeeRate: number;
}
export interface PsbtInputExtended extends PsbtInput, TransactionInput {
}
export type PsbtOutputExtended = PsbtOutputExtendedAddress | PsbtOutputExtendedScript;
export interface PsbtOutputExtendedAddress extends PsbtOutput {
    address: string;
    value: number;
}
export interface PsbtOutputExtendedScript extends PsbtOutput {
    script: Buffer;
    value: number;
}
interface HDSignerBase {
    /**
     * DER format compressed publicKey buffer
     */
    publicKey: Buffer;
    /**
     * The first 4 bytes of the sha256-ripemd160 of the publicKey
     */
    fingerprint: Buffer;
}
export interface HDSigner extends HDSignerBase {
    /**
     * The path string must match /^m(\/\d+'?)+$/
     * ex. m/44'/0'/0'/1/23 levels with ' must be hard derivations
     */
    derivePath(path: string): HDSigner;
    /**
     * Input hash (the "message digest") for the signature algorithm
     * Return a 64 byte signature (32 byte r and 32 byte s in that order)
     */
    sign(hash: Buffer): Buffer;
}
/**
 * Same as above but with async sign method
 */
export interface HDSignerAsync extends HDSignerBase {
    derivePath(path: string): HDSignerAsync;
    sign(hash: Buffer): Promise<Buffer>;
}
export interface Signer {
    publicKey: Buffer;
    network?: any;
    sign(hash: Buffer, lowR?: boolean): Buffer;
    signSchnorr?(hash: Buffer): Buffer;
    getPublicKey?(): Buffer;
}
export interface SignerAsync {
    publicKey: Buffer;
    network?: any;
    sign(hash: Buffer, lowR?: boolean): Promise<Buffer>;
    signSchnorr?(hash: Buffer): Promise<Buffer>;
    getPublicKey?(): Buffer;
}
export interface GetScriptReturn {
    script: Buffer | null;
    isSegwit: boolean;
    isP2SH: boolean;
    isP2WSH: boolean;
}
export interface TransactionInput {
    hash: string | Buffer;
    index: number;
    sequence?: number;
}
export interface PsbtTxInput extends TransactionInput {
    hash: Buffer;
}
export interface TransactionOutput {
    script: Buffer;
    value: number;
}
export interface PsbtTxOutput extends TransactionOutput {
    address: string | undefined;
}
export type TxCacheNumberKey = '__FEE_RATE' | '__FEE';
/**
 * This function must do two things:
 * 1. Check if the `input` can be finalized. If it can not be finalized, throw.
 *   ie. `Can not finalize input #${inputIndex}`
 * 2. Create the finalScriptSig and finalScriptWitness Buffers.
 */
export type FinalScriptsFunc = (inputIndex: number, // Which input is it?
input: PsbtInput, // The PSBT input contents
script: Buffer, // The "meaningful" locking script Buffer (redeemScript for P2SH etc.)
isSegwit: boolean, // Is it segwit?
isP2SH: boolean, // Is it P2SH?
isP2WSH: boolean) => {
    finalScriptSig: Buffer | undefined;
    finalScriptWitness: Buffer | undefined;
};
export type FinalTaprootScriptsFunc = (inputIndex: number, // Which input is it?
input: PsbtInput, // The PSBT input contents
tapLeafHashToFinalize?: Buffer) => {
    finalScriptWitness: Buffer | undefined;
};
export type ValidateSigFunction = (pubkey: Buffer, msghash: Buffer, signature: Buffer) => boolean;
export type AllScriptType = 'witnesspubkeyhash' | 'pubkeyhash' | 'multisig' | 'pubkey' | 'nonstandard' | 'p2sh-witnesspubkeyhash' | 'p2sh-pubkeyhash' | 'p2sh-multisig' | 'p2sh-pubkey' | 'p2sh-nonstandard' | 'p2wsh-pubkeyhash' | 'p2wsh-multisig' | 'p2wsh-pubkey' | 'p2wsh-nonstandard' | 'p2sh-p2wsh-pubkeyhash' | 'p2sh-p2wsh-multisig' | 'p2sh-p2wsh-pubkey' | 'p2sh-p2wsh-nonstandard';
export type ScriptType = 'witnesspubkeyhash' | 'pubkeyhash' | 'multisig' | 'pubkey' | 'nonstandard';
export type SignatureDecodeFunc = (buffer: Buffer) => {
    signature: Buffer;
    hashType: number;
};
export {};
