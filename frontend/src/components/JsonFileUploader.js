import { AddIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { getElementsFromJson } from './LayoutFlow';

const JsonFileUploader = ({
  setElements,
  setJson,
  setJsonMap,
  showTime,
  showNumCalls,
  setError,
}) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  let firstTime = true;
  let map = new Map();
  let counter = 0;
  const getJsonMap = (json, program) => {
    if (firstTime) {
      map.set(json.callGraph.methodName, json);
      firstTime = false;
      if (json.callGraph.calls !== undefined) {
        json.callGraph.calls.forEach((element) => {
          getJsonMap(element, json.program);
        });
      }
    } else {
      if (map.has(json.methodName)) {
        counter += 1;
      } else {
        counter = 0;
      }
      let methodName =
        counter === 0 ? json.methodName : json.methodName + '_' + counter;
      map.set(methodName, { program: program, callGraph: json });
      if (json.calls !== undefined) {
        json.calls.forEach((element) => {
          getJsonMap(element, program);
        });
      }
    }
    return map;
  };

  const validParent = (json) => {
    if (
      json.callGraph === undefined ||
      json.callGraph.methodName === undefined ||
      json.callGraph.calls === undefined
    ) {
      return false;
    }
    return true;
  };

  const validChildren = (calls) => {
    calls.forEach((call) => {
      if (call.methodName === undefined || call.calls === undefined) {
        return false;
      } else {
        validChildren(call.calls);
      }
    });
    return true;
  };

  let jsonResult = {};
  let newObj = {};
  let sCounter = 0;
  let eCounter = 0;
  const parseText = (text) => {
    let lines = text.split('\n').filter((e) => e !== '');
    let programLine = lines[0].split(':');
    programLine.shift();
    if (programLine[0].trim() !== 'Program') {
      setError(true);
      return;
    } else {
      jsonResult['program'] = programLine[1].trim();
      lines.shift();
      lines.forEach((line) => {
        let temp = line.split(' ');
        if (temp[1] === 's:') {
          sCounter++;
        } else if (temp[1] === 'e:') {
          eCounter++;
        }
      });
      if (sCounter !== eCounter) {
        setError(true);
        sCounter = 0;
        eCounter = 0;
        return;
      }
      getChildrenFromText(lines);
      jsonResult['callGraph'] = generateJsonFirst(newObj);
    }
  };

  let textMap = new Map();
  let timeMap = new Map();
  let callMap = new Map();
  const getChildrenFromText = (lines) => {
    let stack = [];
    let firstLine = lines[0].split(' ');
    firstLine.shift();
    stack.push('firstMethod');
    stack.push(firstLine[1].trim());
    textMap.set('firstMethod', { calls: [convertLineToObj(firstLine)] });
    textMap.set(firstLine[1].trim(), { calls: [] });
    lines.shift();
    lines.forEach((line) => {
      let methodLine = line.split(' ');
      methodLine.shift();
      if (methodLine[0] === 's:') {
        let lastItem = stack[stack.length - 1];
        if (textMap.get(lastItem) === undefined) {
          textMap.set(lastItem, { calls: [convertLineToObj(methodLine)] });
        } else {
          let array = textMap.get(lastItem).calls;
          array.push(convertLineToObj(methodLine));
          textMap.set(lastItem, { calls: array });
        }
        stack.push(methodLine[1].trim());
      } else if (methodLine[0] === 'e:') {
        let secondLastItem = stack[stack.length - 2];
          if (timeMap.get(secondLastItem + methodLine[1]) === undefined) {
            timeMap.set(secondLastItem + methodLine[1], {time: [methodLine[2]]});
          } else {
            let array = timeMap.get(secondLastItem + methodLine[1]).time;
            array.push(methodLine[2]);
            timeMap.set(secondLastItem + methodLine[1], {time: array});
          }
          if (callMap.get(methodLine[1]) === undefined) {
            let calls = textMap.get(methodLine[1]);
            callMap.set(methodLine[1], {calls: [calls]});
            textMap.set(methodLine[1], {calls: []})
          } else {
            let array = callMap.get(methodLine[1]).calls;
            let calls = textMap.get(methodLine[1]);
            array.push(calls);
            callMap.set(methodLine[1], {calls: array});
            textMap.set(methodLine[1], {calls: []})
          }
        stack.pop();
      }
    });
  };

  const convertLineToObj = (lineArray) => {
    let classAndParams = lineArray[2].split(',');
    let className = classAndParams[0].substring(1);
    let paramType = '';
    if (classAndParams.length > 2) {
      for (let i = 1; i < classAndParams.length; i++) {
        if (paramType === '') {
          paramType += classAndParams[i];
        } else {
          paramType += ',' + classAndParams[i];
        }
      }
    } else {
      paramType = classAndParams[1];
    }
    let finalParam = paramType.slice(0, -1);
    return {
      id: Math.random(),
      class: className,
      methodName: lineArray[1],
      params: [{ type: finalParam }],
      calls: [],
    };
  };
  const generateJsonFirst = (obj) => {
    let first = textMap.get('firstMethod');
    let calls = callMap.get(first.calls[0].methodName).calls;
    let time = timeMap.get('firstMethod' + first.calls[0].methodName).time;
    obj = {
      id: Math.random(),
      class: first.calls[0].class,
      methodName: first.calls[0].methodName,
      params: first.calls[0].params,
      calls: calls[0].calls,
      time: time[0].substring(1).slice(0, -1),
    };
    if (obj.calls !== undefined) {
      obj.calls.forEach((call) => {
        let time = timeMap.get(obj.methodName + call.methodName).time;
        if (time.length === 0) return;
        call.time = time.shift().substring(1).slice(0, -1);
      });
    }
    generateCalls(obj, firstTime);
    return obj;
  };

  const generateCalls = (obj) => {
    if (obj === undefined || obj.calls === undefined || obj.calls.length === 0)
      return;
    obj.calls.forEach((obj) => {
      if (callMap.get(obj.methodName) === undefined) return;
      let tempCall = callMap.get(obj.methodName).calls.shift();
      if (tempCall === undefined || tempCall.calls === undefined) return;
      obj.calls = tempCall.calls;
      if (obj.calls !== undefined) {
        obj.calls.forEach((call) => {
          let time = timeMap.get(obj.methodName + call.methodName).time;
          if (time.length === 0) return;
          call.time = time.shift().substring(1).slice(0, -1);
        });
      }
      generateCalls(obj);
    });
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      setError(false);
      parseText(event.target.result);
      let json = jsonResult;
      if (!validParent(json) || !validChildren(json.callGraph.calls)) {
        setError(true);
        return;
      }
      setJsonMap(getJsonMap(json));
      setElements(getElementsFromJson(json, true, true, ''));
      setJson(json);
      firstTime = true;
      map = new Map();
      jsonResult = {};
      json = {};
      newObj = {};
      textMap = new Map();
      timeMap = new Map();
      callMap = new Map();
    };
    reader.readAsText(file);
    getBase64(file).then((base64) => {
      sessionStorage.setItem('uploadedJSON', base64);
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ margin: '2%' }}>
      <Button
        variant={'solid'}
        colorScheme={'blue'}
        size={'md'}
        mr={4}
        leftIcon={<AddIcon />}
        onClick={handleClick}
      >
        Upload Log
      </Button>
      <input
        type="file"
        key={Math.random()}
        accept=".log"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};
export default JsonFileUploader;
