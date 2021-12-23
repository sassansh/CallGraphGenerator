const position = { x: 0, y: 0 };
const edgeType = 'step';
const arrowType = 'arrow';

const parentNodeStyle = {
  backgroundColor: '#ed9398',
};
const childNodeStyle = {
  borderColor: '#e75480',
};

const lineStyle = {
  width: 100,
};

const initialElements = [
  {
    id: '1',
    type: 'input',
    style: parentNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Main
          <br />
          <small>main()</small>
          <br />
          <small>time: 250 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '2',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Bank
          <br />
          <small>showMenu()</small>
          <br />
          <small>time: 225 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '3',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Bank
          <br />
          <small>createAccount()</small>
          <br />
          <small>time: 25 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '4',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Bank
          <br />
          <small>showAccountMenu()</small>
          <br />
          <small>time: 50 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '5',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Bank
          <br />
          <small>logIn()</small>
          <br />
          <small>time: 150 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '6',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Account
          <br />
          <small>getCustomerID()</small>
          <br />
          <small>time: 10 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '7',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Account
          <br />
          <small>getCustomerName()</small>
          <br />
          <small>time: 10 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '8',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Account
          <br />
          <small>deposit()</small>
          <br />
          <small>time: 10 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '9',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Account
          <br />
          <small>getBalance()</small>
          <br />
          <small>time: 10 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: '10',
    style: childNodeStyle,
    data: {
      label: (
        <div>
          BankingApp/Account
          <br />
          <small>withdraw()</small>
          <br />
          <small>time: 10 ms</small>
        </div>
      ),
    },
    position,
  },
  {
    id: 'e12',
    source: '1',
    target: '2',
    style: lineStyle,
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e23',
    source: '2',
    target: '3',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e24',
    source: '2',
    target: '4',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e25',
    source: '2',
    target: '5',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e36',
    source: '3',
    target: '6',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e47',
    source: '4',
    target: '7',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e48',
    source: '4',
    target: '8',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e49',
    source: '4',
    target: '9',
    type: edgeType,
    arrowHeadType: arrowType,
  },
  {
    id: 'e410',
    source: '4',
    target: '10',
    type: edgeType,
    arrowHeadType: arrowType,
  },
];

const json = {
  program: 'BankingApp',
  callGraph: {
    class: 'Main',
    methodName: 'main',
    params: [
      {
        type: 'String[]',
        name: 'args',
      },
    ],
    time: 250,
    calls: [
      {
        class: 'Bank',
        methodName: 'showMenu',
        params: [],
        time: 225,

        calls: [
          {
            class: 'Bank',
            methodName: 'createAccount',
            params: [
              {
                type: 'String',
                name: 'customerName',
              },
            ],
            time: 25,
            calls: [
              {
                class: 'BankAccount',
                methodName: 'getCustomerID',
                params: [],
                time: 10,
                calls: [],
              },
            ],
          },
          {
            class: 'Bank',
            methodName: 'logIn',
            params: [
              {
                type: 'int',
                name: 'customerID',
              },
            ],
            time: 150,
            calls: [],
          },
          {
            class: 'Bank',
            methodName: 'showAccountMenu',
            params: [
              {
                type: 'BankAccount',
                name: 'userAcc',
              },
            ],
            time: 50,
            calls: [
              {
                class: 'BankAccount',
                methodName: 'getCustomerName',
                params: [],
                time: 10,
                calls: [],
              },
              {
                class: 'BankAccount',
                methodName: 'deposit',
                params: [
                  {
                    type: 'int',
                    name: 'depositAmt',
                  },
                ],
                time: 10,
                calls: [],
              },
              {
                class: 'BankAccount',
                methodName: 'withdraw',
                params: [
                  {
                    type: 'int',
                    name: 'withdrawAmt',
                  },
                ],
                time: 10,
                calls: [],
              },
              {
                class: 'BankAccount',
                methodName: 'getBalance',
                params: [],
                time: 10,
                calls: [],
              },
            ],
          },
        ],
      },
    ],
  },
};
export { position, edgeType, arrowType, initialElements, json };
