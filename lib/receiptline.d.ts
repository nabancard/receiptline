declare type Encoding = 'cp437' | 'cp852' | 'cp858' | 'cp860' | 'cp863' | 'cp865' | 'cp866' | 'cp1252' | 'cp932' | 'cp936' | 'cp949' | 'cp950' | 'multilingual' | 'shiftjis' | 'gb18030' | 'ksc5601' | 'big5';
interface Printer {
    cpl?: number;
    encoding?: Encoding;
    upsideDown?: boolean;
    spacing?: boolean;
    cutting?: boolean;
    gradient?: boolean;
    gamma?: number;
    threshold?: number;
    command?: keyof Commands | BaseCommand;
}
interface QRCode {
    data: string;
    type: string;
    cell: string;
    level: string;
}
interface Barcode {
    data: string;
    type: string;
    width: number;
    height: number;
    hri: boolean;
}
interface BarcodeModule {
    module: string;
    length: number;
    hri: string;
}
interface BaseCommand {
    charWidth: number;
    measureText(text: string, encoding: Encoding): number;
    open(printer: Printer): string;
    close(): string;
    area(left: number, width: number, right: number): string;
    align(align: number): string;
    absolute(position: number): string;
    relative(position: number): string;
    hr(width: number): string;
    vr(widths: number[], height: number): string;
    vrstart(widths: number[]): string;
    vrstop(widths: number[]): string;
    vrhr(widths1: number[], widths2: number[], d1: number, dr: number): string;
    vrlf(vr: boolean): string;
    cut(): string;
    ul(): string;
    em(): string;
    iv(): string;
    wh(wh: number): string;
    normal(): string;
    text(test: string, encoding: Encoding): string;
    lf(): string;
    command(command: string): string;
    image(image: string, align: number, left: number, width: number, right: number): string;
    qrcode(symbol: QRCode, encoding: Encoding): string;
    barcode(symbol: Barcode, encoding: Encoding): string;
}
interface SVGCommand extends BaseCommand {
    svgWidth: number;
    svgHeight: number;
    svgContent: string;
    lineMargin: number;
    lineAlign: number;
    lineWidth: number;
    lineHeight: number;
    textElement: string;
    textAttributes: Record<string, string>;
    textPosition: number;
    textScale: number;
    textEncoding: Encoding;
    feedMinimum: number;
    spacing: boolean;
    c128: {
        element: string[];
        starta: number;
        startb: number;
        startc: number;
        atob: number;
        atoc: number;
        btoa: number;
        btoc: number;
        ctoa: number;
        ctob: number;
        shift: number;
        stop: number;
    };
    code128(data: string): BarcodeModule;
    code128a(start: number, data: string, digits: number[]): void;
    code128b(start: number, data: string, digits: number[]): void;
    code128c(start: number, data: string, digits: number[]): void;
    c93: {
        escape: string[];
        code: Record<string, number>;
        element: string[];
        start: number;
        stop: number;
    };
    code93(data: string): BarcodeModule;
    nw7: Record<string, string>;
    codabar(data: string): BarcodeModule;
    i25: {
        element: string[];
        start: string;
        stop: string;
    };
    itf(data: string): BarcodeModule;
    c39: Record<string, string>;
    code39(data: string): BarcodeModule;
    ean: Record<string, string[]>;
    upca(data: string): BarcodeModule;
    upce(data: string): BarcodeModule;
    upcetoa(data: string): BarcodeModule;
    ean13(data: string): BarcodeModule;
    ean8(data: string): BarcodeModule;
}
interface GenericCommand extends BaseCommand {
    upsideDown: boolean;
    spacing: boolean;
    cutting: boolean;
    gradient: boolean;
    gamma: number;
    threshold: number;
}
interface PrinterCommand extends GenericCommand {
    codepage: Record<keyof Encoding, string>;
    multiconv(text: string): string;
    vrtable: Record<string, Record<string, string>>;
}
interface ThermalCommand extends PrinterCommand {
    split: number;
    qrlevel: {
        1: number;
        m: number;
        q: number;
        h: number;
    };
    bartype: {
        upc: number;
        ean: number;
        jan: number;
        code39: number;
        itf: number;
        codabar: number;
        nw7: number;
        code93: number;
        code128: number;
    };
    upce(data: string): string;
    c128: {
        special: number;
        codea: number;
        codeb: number;
        codec: number;
        shift: number;
    };
    code128(data: string): string;
    code128a(start: number, data: string, digits: number[]): void;
    code128b(start: number, data: string, digits: number[]): void;
    code128c(start: number, data: string, digits: number[]): void;
}
interface SIICommand extends Omit<ThermalCommand, 'c128'> {
    codabar(data: string): string;
    c93: {
        escape: string[];
        code: Record<string, number>;
        start: number;
        stop: number;
    };
    code93(data: string): string;
    c128: {
        starta: number;
        startb: number;
        startc: number;
        atob: number;
        atoc: number;
        btoa: number;
        btoc: number;
        ctoa: number;
        ctob: number;
        shift: number;
        stop: number;
    };
}
interface ImpactCommand extends PrinterCommand {
    font: number;
    style: number;
    color: number;
    margin: number;
    position: number;
    red: {
        data: string;
        index: number;
        length: number;
    }[];
    black: {
        data: string;
        index: number;
        length: number;
    }[];
}
interface StarCommand extends PrinterCommand {
    split: number;
    qrlevel: {
        1: number;
        m: number;
        q: number;
        h: number;
    };
    bartype: {
        upc: number;
        ean: number;
        jan: number;
        code39: number;
        itf: number;
        codabar: number;
        nw7: number;
        code93: number;
        code128: number;
    };
    upce(data: string): string;
    code128(data: string): string;
}
interface Commands {
    base: BaseCommand;
    svg: SVGCommand;
    escpos: ThermalCommand;
    sii: SIICommand;
    citizen: ThermalCommand;
    fit: ThermalCommand;
    impact: ImpactCommand;
    impactb: ImpactCommand;
    starsbcs: StarCommand;
    starmbcs: StarCommand;
    starmbcs2: StarCommand;
    starlinesbcs: StarCommand;
    starlinembcs: StarCommand;
    starlinembcs2: StarCommand;
    emustarlinesbcs: StarCommand;
    emustarlinembcs: StarCommand;
    emustarlinembcs2: StarCommand;
    stargraphic: GenericCommand;
}
declare global {
    interface Window {
        qrcode: unknown;
    }
}
/**
 * Function - transform
 * Transform ReceiptLine document to printer commands or SVG images.
 * @param {string} doc ReceiptLine document
 * @param {object} printer printer configuration
 * @returns {string} printer command or SVG image
 */
declare function transform(doc: string, printer: Printer): string;
/**
 * Function - createTransform
 * Create transform stream that converts ReceiptLine document to printer commands or SVG images.
 * @param {object} printer printer configuration
 * @returns {stream.Transform} transform stream
 */
declare function createTransform(printer: Printer): any;
declare const receiptline: {
    getLangEncoding: (lang: typeof window.navigator.language) => Encoding;
    commands: Commands;
    createTransform: typeof createTransform;
    transform: typeof transform;
};
export default receiptline;
export type { Encoding };
