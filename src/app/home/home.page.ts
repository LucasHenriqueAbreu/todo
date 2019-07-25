import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { getRepository, Like, Repository } from 'typeorm';

import { Status, Todo } from '../entities/todo';
import { ModalPage } from './modal/modal.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  query = '';
  todosProntos: Todo[] = [];
  todosAbertos: Todo[] = [];
  todoRepository: Repository<Todo>;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController
  ) {
    this.todoRepository = getRepository('todo') as Repository<Todo>;
  }

  ngOnInit(): void {
    this.buscarTarefas();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });

    modal.onDidDismiss().then(() => this.buscarTarefas());
    return await modal.present();
  }

  async buscarTarefas() {
    try {
      const todoLista = await this.todoRepository.find({
        titulo: Like(`%${this.query}%`)
      });
      this.todosProntos = todoLista.filter(todo => todo.status === Status.pronto) || [];
      this.todosAbertos = todoLista.filter(todo => todo.status === Status.aberto) || [];
    } catch (error) {
      this.presentToast(`Não foi possível buscar as tarefas. Erro: ${error}`);
    }
  }

  async alternarTarefa(todo: Todo, abrir: boolean) {
    todo.status = abrir ? Status.aberto : Status.pronto;
    await this.todoRepository.save(todo);
    this.buscarTarefas();
    this.presentToast(`Tarefa ${abrir ? 'aberta' : 'fechada'} com sucesso.`);
  }


  async excluirTarefa(todo: Todo) {
    const alert = await this.alertController.create({
      header: 'Confirmação!',
      message: `Tem certeza que deseja remover a tarefa <strong>${todo.title}</strong>?`,
      buttons: [
        {
          text: 'Não',
          role: 'nao',
          cssClass: 'primary',
        }, {
          text: 'Sim',
          handler: () => {
            this.todoRepository.delete(todo);
            this.buscarTarefas();
            this.presentToast('Tarefa removida com sucesso.');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
