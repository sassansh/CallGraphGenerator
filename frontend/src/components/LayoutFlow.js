import '../layouting.css';

import React, { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  isNode,
  removeElements,
} from 'react-flow-renderer';
import { arrowType, edgeType, position } from '../assets/initial-elements';
import { generateColour, getMethodStats } from './Helpers';

import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Heading } from '@chakra-ui/react';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

let currentDirection = 'TB';
let programName = '';
let idList = [];
let classColours = {};
const getParent = (program, json, showTime) => {
  let elements = [];
  programName = program;
  elements.push({
    id: json.methodName + json.id,
    type: 'input',
    style: {
      backgroundColor: '#ed9398',
      borderColor: json.time > 200 ? '#ff0000' : '#e75480',
      borderWidth: json.time > 200 ? 'thick' : 'thin',
      borderRadius: 10,
    },
    data: {
      label: (
        <div>
          <b>{json.methodName + getParams(json.params)}</b>
          <br />
          <small>{json.class}</small>
          <br />
          {showTime ? <small>{'time: ' + json.time + ' ms'}</small> : null}
        </div>
      ),
    },
    position: position,
  });
  idList.push(json.methodName + json.id);
  if (json.calls !== undefined) {
    json.calls.forEach((call) => {
      if (
        !idList.includes(
          'edge' + json.methodName + 'To' + call.methodName + json.id + call.id
        )
      ) {
        idList.push(
          'edge' + json.methodName + 'To' + call.methodName + json.id + call.id
        );
        elements.push({
          id:
            'edge' +
            json.methodName +
            'To' +
            call.methodName +
            json.id +
            call.id,
          source: json.methodName + json.id,
          target: call.methodName + call.id,
          type: edgeType,
          arrowHeadType: arrowType,
        });
      }
    });
  }
  return elements;
};

let children = [];

const getChildren = (calls, showTime, showNumCalls) => {
  let uniqueLeafMethods = [];
  calls.forEach((call) => {
    if (call.class in classColours === false) {
      classColours[call.class] = generateColour();
    }
    let stats = getMethodStats(calls, call);
    let counter = stats[0];
    let timer = stats[1];
    let isLeaf = call.calls.length === 0;
    if (uniqueLeafMethods.indexOf(call.methodName) === -1) {
      if (isLeaf) {
        uniqueLeafMethods.push(call.methodName);
      }
      if (!idList.includes(call.methodName + call.id)) {
        idList.push(call.methodName + call.id);
        children.push({
          id: call.methodName + call.id,
          style: {
            backgroundColor: classColours[call.class],
            borderColor: timer > 200 ? '#ff0000' : '#e75480',
            borderWidth: timer > 200 ? 'thick' : 'thin',
            borderRadius: 10,
          },
          data: {
            label: (
              <div>
                <b>{call.methodName + getParams(call.params)}</b>
                <br />
                <small>{call.class}</small>
                <br />
                {counter !== 1 && isLeaf && showNumCalls ? (
                  <small>
                    {'number of times called: ' + counter}
                    <br />
                  </small>
                ) : null}
                {showTime ? (
                  counter !== 1 && isLeaf ? (
                    <small>{'average runtime: ' + timer + ' ms'}</small>
                  ) : (
                    <small>{'time: ' + call.time + ' ms'}</small>
                  )
                ) : null}
              </div>
            ),
          },
          position: position,
        });
      }
    }
    if (call.calls !== undefined && call.methodName !== undefined) {
      getChildren(call.calls, showTime, showNumCalls);
      call.calls.forEach((call2) => {
        if (
          !idList.includes(
            'edge' +
              call.methodName +
              'To' +
              call2.methodName +
              call.id +
              call2.id
          )
        ) {
          idList.push(
            'edge' +
              call.methodName +
              'To' +
              call2.methodName +
              call.id +
              call2.id
          );
          children.push({
            id:
              'edge' +
              call.methodName +
              'To' +
              call2.methodName +
              call.id +
              call2.id,
            source: call.methodName + call.id,
            target: call2.methodName + call2.id,
            type: edgeType,
            arrowHeadType: arrowType,
          });
        }
      });
    }
  });
  return children;
};

const getParams = (params) => {
  let string = '';
  let firstParam = true;
  params.forEach((param) => {
    if (firstParam) {
      string += param.type;
      firstParam = false;
    } else {
      string += ', ' + param.type;
    }
  });
  return string;
};

const nodeWidth = 172;
const nodeHeight = 100;

const getLayoutedElements = (elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? 'left' : 'top';
      el.sourcePosition = isHorizontal ? 'right' : 'bottom';

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

export const getElementsFromJson = (
  json,
  showTime,
  showNumCalls,
  searchValue
) => {
  let result = getLayoutedElements(
    getParent(json.program, json.callGraph, showTime).concat(
      getChildren(json.callGraph.calls, showTime, showNumCalls)
    ),
    currentDirection
  );
  result = searchElements(searchValue, result);
  children = [];
  idList = [];
  return result;
};

const searchElements = (searchValue, elements) => {
  // Return original elements if search value is empty
  if (searchValue === '') {
    return elements;
  }

  elements.forEach((element, index) => {
    if (
      element.id.toLowerCase().includes(searchValue.toLowerCase()) &&
      !element.hasOwnProperty('source')
    ) {
      console.log(elements[index].style);
      elements[index].style.borderColor = '#5271FF';
      elements[index].style.borderWidth = '12px';
    }
  });

  return elements;
};

const LayoutFlow = ({ elements, setElements, error }) => {
  const onConnect = (params) =>
    setElements((els) =>
      addEdge({ ...params, type: 'smoothstep', animated: true }, els)
    );
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLayout = useCallback(
    (direction) => {
      currentDirection = direction;
      const layoutedElements = getLayoutedElements(elements, direction);
      setElements(layoutedElements);
    },
    [elements, setElements]
  );
  return (
    <>
      <div className="controls">
        <Button mt={2} mr={2} onClick={() => onLayout('TB')}>
          Vertical
        </Button>
        <Button mt={2} onClick={() => onLayout('LR')}>
          Horizontal
        </Button>
      </div>
      {programName !== '' ? (
        <Heading
          color={'gray.800'}
          lineHeight={1.1}
          fontSize={'xl'}
          paddingTop={'10px'}
        >
          {'Program Name: ' + programName}
        </Heading>
      ) : null}
      <Box
        borderWidth="3px"
        borderRadius="lg"
        overflow="hidden"
        maxHeight="700px"
        mt={2}
        rounded={'lg'}
        textAlign={'center'}
      >
        <div className="layoutflow" style={{ height: 1500, width: 1500 }}>
          <ReactFlowProvider>
            {error ? (
              <h1>Please upload a log file with correct format</h1>
            ) : (
              <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                connectionLineType="smoothstep"
              />
            )}
          </ReactFlowProvider>
        </div>
      </Box>
    </>
  );
};

export default LayoutFlow;
