import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
window.React = require("react")

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })
