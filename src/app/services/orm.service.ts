import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
  createConnection,
  ConnectionOptions,
  getConnection,
  Connection
} from 'typeorm';
import { Todo } from '../entities/todo';


@Injectable({
  providedIn: 'root'
})
export class OrmService {

  constructor(private platform: Platform) { }

  private createConnection(): Promise<Connection> {
    let dbOptions: ConnectionOptions;

    if (this.platform.is('cordova')) {

      dbOptions = {
        type: 'cordova',
        database: '__todo',
        location: 'default'
      };
    } else {

      dbOptions = {
        type: 'sqljs',
        location: 'browser',
        autoSave: true
      };
    }

    Object.assign(dbOptions, {
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [
        Todo
      ]
    });

    return createConnection(dbOptions);
  }


  async ready() {
    try {
      await getConnection();
    } catch (ex) {
      console.log('Algo deu errado na conexão! :(', ex);
      await this.createConnection();

    }
  }
}
