import { commands } from './printer-commands';
/**
 * ESCPOS printer
 */

export class ESCPOSPrinter {

    // Buffer
    private buffer: Buffer;

    /**
     * Constructor
     * @param buffer 
     */
    constructor(buffer: Buffer) {
        // Init buffer
        this.buffer = buffer;
    }

    /**
     * Write buffer
     * @param buffer 
     */
    private write(buffer: Buffer) {
        this.buffer = Buffer.concat([this.buffer, buffer]);
    }

    /**
     * Print raster
     * @param image 
     * @param mode 
     */
    public raster(image: ESCPOSImage, mode: string = 'normal') {
        // Get header
        let header = COMMANDS.S_RASTER_N;

        // Get raster
        let raster = image.toRaster();

        // Set alignment
        this.align('center');

        // Write header
        this.write(new Buffer(header));
        this.write(new Buffer([raster.width, 0]));
        this.write(new Buffer([raster.height, 0]));
        // Write data
        this.write(new Buffer(raster.data));
    }

    /**
     * Print line
     */
    public printLn() {
        this.write(new Buffer([commands.FEED_CONTROL_SEQUENCES.CTL_CR, commands.FEED_CONTROL_SEQUENCES.CTL_LF]));
    }

    /**
     * Align 
     * @param alignment ['left', 'center', 'right'] 
     */
    public align(alignment: string = 'left') {
        // Create alignment dictionary
        const aligments = {
            ['left']: commands.TEXT_FORMAT.TXT_ALIGN_LT,
            ['center']: commands.TEXT_FORMAT.TXT_ALIGN_CT,
            ['right']: commands.TEXT_FORMAT.TXT_ALIGN_RT
        }

        // Write alignment
        this.write(new Buffer(aligments[alignment]));
    }

    /**
     * Get buffer
     */
    public getBuffer(): Buffer {
        return this.buffer;
    }
}