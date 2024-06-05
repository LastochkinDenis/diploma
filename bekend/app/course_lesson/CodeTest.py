import subprocess
import base64
import json
import os
import io
import tempfile


def testPy(lesson, program):
    result = True
    
    programLenguges = {
        'py': 'python3',
        'jv': 'java',
        'c#': 'c#'
    }


    if not lesson.conetntObject.testFile:
        return False
    
    
    byte_string = lesson.conetntObject.testFile.read()

    data = json.loads(byte_string.decode('utf-8'))
    resultText = ''
    
    for nuberTest ,testData in enumerate(data, start=1):
        testInput = ''
        for value in testData.get('inputData'):
            testInput += str(value) + '\n'
        
        testLenguage = programLenguges.get(lesson.conetntObject.programLanguage, '')

        process = ''

        if testLenguage == 'python3':
            process = subprocess.run(
                [testLenguage, '-c', program],
                input=testInput,
                capture_output=True,
                text=True
            )
        elif testLenguage == 'java':
            with tempfile.NamedTemporaryFile("w", suffix=".java") as f:
                nameClass = f.name.split('/')[-1].replace('.java', '')
                programTest = program.replace('Main', nameClass)
                f.write(programTest)
                f.flush()

                subprocess.run(["javac", f.name])
                process = subprocess.run(["java", f.name], input=testInput, capture_output=True, text=True) 
        elif testLenguage == 'c#':
             with tempfile.NamedTemporaryFile("w", suffix=".cs") as f:
                f.write(program)
                f.flush()

                temp_dir = tempfile.TemporaryDirectory()
                subprocess.run(["dotnet", "new", "console", "-n", "temp", "-o", temp_dir.name])

                with open(f"{temp_dir.name}/Program.cs", "w") as f:
                    f.write(program)

                try:
                    subprocess.run(["dotnet", "build", f"{temp_dir.name}/temp.csproj"])
                    process = subprocess.run(["dotnet", "run", "--project", f"{temp_dir.name}/temp.csproj"], input=testInput, capture_output=True, text=True)
                except subprocess.CalledProcessError as e:  
                    resultText += process.stdout.strip()
        try:
            assert str(process.stdout.strip()) == str(testData.get('result', ''))
            resultText += f'Test {nuberTest}: {process.stdout.strip()} == {str(testData.get("result", ""))}\n'
        except AssertionError:
            result = False
            if process.stderr and testLenguage == 'c#':
                resultText += f'Test {nuberTest}: {process.stdout.strip()}\n'
            elif process.stderr:
                resultText += process.stderr
            else:
                resultText += f'Test {nuberTest}: {process.stdout.strip()} != {str(testData.get("result", ""))}'
            break
        
    return result, resultText
    
    
