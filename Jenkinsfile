pipeline {
    agent any

    stages {
        stage('Node.js Deps') {
            steps {
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
