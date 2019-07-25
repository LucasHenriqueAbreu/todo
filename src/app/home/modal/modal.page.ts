import { Component, OnInit } from '@angular/core';
import { Todo, Status } from 'src/app/entities/todo';
import { getRepository, Repository } from 'typeorm';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  todo: Todo = new Todo();

  constructor(
    private modalCtrl: ModalController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async salvar() {
    try {
      this.todo.status = Status.aberto;
      const todoRepository = getRepository('todo') as Repository<Todo>;
      await todoRepository.save(this.todo);
      this.presentToast('Tarefa salva com sucesso');
      this.closeModal();
    } catch (error) {
      this.presentToast(`Não foi possível salvar a tarefa. Erro: ${error}`);
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
