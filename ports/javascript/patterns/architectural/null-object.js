export class MemoryLogger {
    lines = [];
    info(message) {
        this.lines.push(`INFO ${message}`);
    }
    error(message) {
        this.lines.push(`ERROR ${message}`);
    }
}
export class NullLogger {
    info() { }
    error() { }
}
export class PaymentService {
    logger;
    constructor(logger = new NullLogger()) {
        this.logger = logger;
    }
    charge(amount) {
        if (amount <= 0) {
            this.logger.error(`invalid amount ${amount}`);
            return false;
        }
        this.logger.info(`charged ${amount}`);
        return true;
    }
}
