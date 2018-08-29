def onRelease(Closure body) {
  def describe = sh(returnStdout: true, script: "git describe").trim()
  if (describe ==~ /^v\d+.\d+.\d+(-RC\d+)?/)
    body(describe.replace("v", ""))
}

node("JenkinsOnDemand") {
    
    stage("Checkout") {
        checkout([
            $class: 'GitSCM',
            branches: scm.branches,
            doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
            extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
            userRemoteConfigs: scm.userRemoteConfigs,
       ])
    }

    stage("Build") {
        sh "npm install"
        sh "npm run build-prod-tar"
    }

    if (currentBuild.result == 'UNSTABLE') {
        currentBuild.result = 'FAILURE'
        error("Errors in tests")
    }

    onRelease { version ->
      stage("Create GitHub Release") {
          echo "Release ${version}"
          def releaseInfo = createReleaseInGithub(version, version, repository)
          def props = readJSON text: "${releaseInfo}"
          def releaseFile = "mist-ui-${curVersion}.tar.gz"
          uploadFilesToGithub(props.id, releaseFile, releaseFile, repository)
      }
    }
}
