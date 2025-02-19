import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/loginPage';

import { DashPage } from '../pages/DashPage';

import { LoginAction } from '../actions/loginAction';

import { cleanJobs, getJob } from '../support/redis';

test('Não deve logar quando o código 2FA é inválido', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  await loginPage.acessaPagina()
  await loginPage.informaCPF(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informa2FA('123456')

  await expect(await dashPage.obterMsgCodigoInvalido()).toContainText('Código inválido. Por favor, tente novamente.');

});

test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await cleanJobs() //limpando a fila do Redis com a função do bullmq antes de obter o código 2FA

  await loginPage.acessaPagina()
  await loginPage.informaCPF(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  //await page.waitForTimeout(3000) //TimeOut temporário para dar tempo a api gerar e retornar o codigo de autenticação.

  //checkpoint
  await page.getByRole('heading', {name: 'Verificação em duas etapas'}) //heading é o H1 do html
  .waitFor({timeout: 3000}) //aguardando até 3 segundos aparecer na pagina de informar o codigo 2FA

  //const code = await obterCodigo2FA(usuario.cpf)

  const code = await getJob() //Pegando o codigo 2FA da fila. Usando a função que usa o bullmq para pegar da fila do Redis

  await loginPage.informa2FA(code)

  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00') //o playwright tem um timeout proprio de 5 segundos.
  
});

//Padrão Action deve ser usado em sistemas menores. Caso sistema grande e robusto melhor usar o PageObject
/* test('Deve acessar a conta do usuário (padrão Actions)', async ({ page }) => {

  const loginAction = new LoginAction(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginAction.acessaPagina()
  await loginAction.informaCPF(usuario.cpf)
  await loginAction.informaSenha(usuario.senha)
  
  //await page.waitForTimeout(3000) //TimeOut temporário para dar tempo a api gerar e retornar o codigo de autenticação.

  //checkpoint
  await page.getByRole('heading', {name: 'Verificação em duas etapas'}) //heading é o H1 do html
  .waitFor({timeout: 4000}) //aguardando até 3 segundos aparecer na pagina de informar o codigo 2FA

  const code = await obterCodigo2FA(usuario.cpf)

  await loginAction.informa2FA(code)

  await expect(await loginAction.obterSaldo()).toHaveText('R$ 5.000,00') //o playwright tem um timeout proprio de 5 segundos.
  
});
*/