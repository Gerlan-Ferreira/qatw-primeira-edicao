pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright'
            args '--network qatw-primeira-edicao_skynet'
        }
    }

    stages {
        stage('Node.js Deps') {
            steps {
                sh 'npm install -g yarn'
                sh 'yarn install'

            }
        }
        stage('E2E Tests') {
            steps {
                sh 'yarn playwright test'
            }
        }
    }
}
