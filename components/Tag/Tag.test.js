import * as React from "react"
import { shallow } from "enzyme"
import Tag from "./Tag"


test("Should Render Tag", () => {
  const wrapper = shallow(<Tag>Hello</Tag>)
  expect(wrapper).toMatchSnapshot()
})
