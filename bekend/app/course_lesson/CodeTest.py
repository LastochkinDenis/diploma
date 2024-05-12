import subprocess
import base64
import json
import os
import io
import tempfile
"""
using System;


class Program

{

    static void Main(string[] args)

    {

        Console.Write("Enter the first number: ");

        int num1 = Convert.ToInt32(Console.ReadLine());


        Console.Write("Enter the second number: ");

        int num2 = Convert.ToInt32(Console.ReadLine());


        int sum = AddTwoNumbers(num1, num2);


        Console.WriteLine("The sum of the two numbers is: " + sum);

    }


    static int AddTwoNumbers(int num1, int num2)

    {

        return num1 + num2;

    }

}"""

def testPy(lesson, program):
    result = True
    
    programLenguges = {
        'py': 'python',
        'jv': 'java',
        'c#': 'c#'
    }


    if not lesson.conetntObject.testFile:
        return False
    
    
    byte_string = lesson.conetntObject.testFile.read()

    data = json.loads(byte_string.decode('utf-8'))
    
    for testData in data:
        testInput = ''
        for value in testData.get('inputData'):
            testInput += str(value) + '\n'
        
        testLenguage = programLenguges.get(lesson.conetntObject.programLanguage, '')

        process = ''

        if testLenguage == 'python':
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

                subprocess.run(["dotnet", "build", f"{temp_dir.name}/temp.csproj"])
                process = subprocess.run(["dotnet", "run", "--project", f"{temp_dir.name}/temp.csproj"], input=testInput, capture_output=True, text=True)

                print(process.stdout.strip())
        try:
            assert str(process.stdout.strip()) == str(testData.get('result', ''))
        except AssertionError:
            result = False
            break
        
    return result
    