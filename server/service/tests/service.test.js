import {describe, it, mock} from "node:test"
import assert from "node:assert/strict"
import { mockTerritories } from "./mocks.js"
import { computerReinforce } from "../../helper/logics.js"

describe("check adding soldiers to beirut", () => {
    it("zidon's owner is the player, with 10 soldiers, should add 3 sodleirs to beirut", () => {
        let mock1 = mockTerritories
        mock1[3].owner = "player"
        mock1[3].soldiers = 10
        const {territories, toId} = computerReinforce(mock1)
        let expected = mock1
        expected[0].soldiers += 3
        assert.deepEqual(territories, expected )

    })
})