import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LogErrorsService {
    constructor(
        private readonly eventEmitter: EventEmitter2
    ) {}

    log(tableName: string, error: any, nota: string){
        this.eventEmitter.emit(
            'errorLogged', 
        )
    }
}
