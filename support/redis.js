//o bullmq é uma biblioteca usada para ler as filas do Redis

import { Queue } from 'bullmq';

const connection = {
    host: 'paybank-redis', 
    port: '6379'
}

const queueName = 'twoFactorQueue' //guardando a fila do Redis na constante

const queue = new Queue(queueName, {connection}) //Instanciando o bullmq e se inscrevendo na fila do Redis.

export const getJob = async () => {
    const jobs = await queue.getJobs() //busca todos os jobs da fila
    return jobs[0].data.code //pegando o último job
}

export const cleanJobs = async () => {
    await queue.obliterate({force:true})   //limpa a fila do Redis
}
