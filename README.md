## English
### esm-cjs-converter
- Convert ES modules to CommonJS
- Convert CommonJS to ES modules

### usage
![](https://static.zhufengpeixun.com/esmcjsconverter_1680840927105.png)
#### Convert ES modules to CommonJS
Before
```js
import { a } from './a.js';
import b from './b.js';

export var c = 1;
export default 2
```

After
```js
const {a} = require('./a.js');
const b = require('./b.js');
var c = 1;
exports.c = c;
module.exports = 2;
```

#### Convert CommonJS to ES modules
Before
```js
const {a} = require('./a.js');
const b = require('./b.js');
var c = 1;
exports.c = c;
module.exports = 2;
```

After
```js
import { a } from "./a.js";
import b from "./b.js";
var c = 1;
export { c };
export default 2;
```

## 中文
### esm-cjs-converter
- 将 ES 模块转换为 CommonJS
- 将 CommonJS 转换为 ES 模块

### 使用方法
![](https://static.zhufengpeixun.com/esmcjsconverter_1680840927105.png)
#### 把 ES modules 转成 CommonJS
Before
```js
import { a } from './a.js';
import b from './b.js';

export var c = 1;
export default 2
```

After
```js
const {a} = require('./a.js');
const b = require('./b.js');
var c = 1;
exports.c = c;
module.exports = 2;
```

####  把  CommonJS 转成 ES modules
Before
```js
const {a} = require('./a.js');
const b = require('./b.js');
var c = 1;
exports.c = c;
module.exports = 2;
```

After
```js
import { a } from "./a.js";
import b from "./b.js";
var c = 1;
export { c };
export default 2;
```