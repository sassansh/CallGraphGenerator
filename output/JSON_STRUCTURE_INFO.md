# JSON Output File

The call graph data is stored as a JSON object literal:

```
{   
    "program": "MyProgram"
    "callGraph":
    {
        "className": "MainClass",
        "methodName": "main",
        "params": [
            {
                "type": "String[],
                "name": "args"
            }
        ],
        "time": 100,
        "calls": [
            {
              "className": "class1",
              "methodName":"method1",
              "params": [],
              "time": 25,
              "calls": []
            },
            {
              "className": "class2",
              "methodName": "method2",
              "time": 50,
              "params": [
                {
                    "type": "int",
                    "name": "val1"
                },
                {
                    "type": "int",
                    "name": "val2"
                }
              ],
              "calls": []
            }
        ]
    }
}
```

The JSON output has two fields, with `callGraph` containing a method object that details the relationships between 
method 
calls:

| Key | Value | Value Type |
| --- | --- | --- |
| program | The name of the program being analyzed | string |
| callGraph | The call graph data| object |

A method object can have the following key-value pairs:

| Key | Value | Value Type |
| --- | --- | --- |
| className | The name of the class that the method is declared in| string |
| methodName | The name of the method | string |
| params | The parameters passed into the method | array of objects |
| time | The amount of time the method takes to run, in milliseconds | int |
| calls | All the methods that this method calls (outside of conditionals), in order of sequence | array of objects |

The parameter objects found in `params` are defined like this:

| Key | Value | Value Type |
| --- | --- | --- |
| type | The type of the parameter | string |
| name | The name of the parameter| array |


`calls` contains an array of method objects.




