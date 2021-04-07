const assert = require('assert');
const RealmService = require('../services/realm.service');
const MockStudents = require('./mock/students');
const MockClans = require('./mock/clans');
const MockRealm = require('./mock/realm');
const MockRealms = require('./mock/realms');
const MockRealmLevelUp = require('./mock/realm.for.level.up');
const MockRealmLevelUp_2 = require('./mock/realm.level.up.2');
const MockRealmCollaborators = require('./mock/realm.collaborators');
const GoogleUsers = require('./mock/google.users');
const MockMonsters = require('./mock/monsters');
const MockRealmCloakUp = require('./mock/realm.cloak.change');
const StudProp = require('../constants/student.properties');
let clans;
let students;
let realm;
let realmLevelUp;
let realmLevelUp_2;
let realmCollaborators;
let googleUsers;
let monsters;
let mockRealmCloakUp;

describe('RealmService', () => {
  beforeEach(() => {
    students = MockStudents
    clans = MockClans;
    realm = MockRealm;
    realmLevelUp = MockRealmLevelUp;
    realmLevelUp_2 = MockRealmLevelUp_2;
    realmCollaborators = MockRealmCollaborators;
    googleUsers = GoogleUsers;
    monsters = MockMonsters;
    mockRealmCloakUp = MockRealmCloakUp
  });
  describe('findElementById tests', () => {
    it('should return null if array is null', () => {
      const result = RealmService.findElemById(null, '602b961f21ae205a2cdb9b61');
      assert.strictEqual(result, null);
    });
    it('should return null if array is empty', () => {
      const result = RealmService.findElemById([], '602b961f21ae205a2cdb9b61');
      assert.strictEqual(result, null);
    });
    it('should return null if there is no ID', () => {
      const result = RealmService.findElemById(students, null);
      assert.strictEqual(result, null);
    });
    it('should return Cartman', () => {
      const result = RealmService.findElemById(students, '602b961f21ae205a2cdb9b61');
      assert.strictEqual(result.name, 'Cartman');
    });
    it('should undefined if there is no match', () => {
      const result = RealmService.findElemById(students, 'not existing ID');
      assert.strictEqual(result, undefined);
    });
  });

  describe('getStudentClanLevel tests', () => {
    it('should return 1 if no studentClan', () => {
      const result = RealmService.getStudentClanLevel(null, clans);
      assert.strictEqual(result, 1);
    });
    it('should return 1 if no clans', () => {
      const result = RealmService.getStudentClanLevel('603f3b5fb70c640024be589e', null);
      assert.strictEqual(result, 1);
    });
    it('should return 1 if clan list is empty', () => {
      const result = RealmService.getStudentClanLevel(null, []);
      assert.strictEqual(result, 1);
    });
    it('should return 2', () => {
      const result = RealmService.getStudentClanLevel('603f3b5fb70c640024be589e', clans);
      assert.strictEqual(result, 2);
    });
  });

  describe('getStudentClanLevel tests', () => {
    it('should return 1 if no studentClan', () => {
      const result = RealmService.getStudentClanLevel(null, clans);
      assert.strictEqual(result, 1);
    });
    it('should return 1 if no clans', () => {
      const result = RealmService.getStudentClanLevel('603f3b5fb70c640024be589e', null);
      assert.strictEqual(result, 1);
    });
    it('should return 1 if clan list is empty', () => {
      const result = RealmService.getStudentClanLevel(null, []);
      assert.strictEqual(result, 1);
    });
    it('should return 2', () => {
      const result = RealmService.getStudentClanLevel('603f3b5fb70c640024be589e', clans);
      assert.strictEqual(result, 2);
    });
  });

  describe('countModifiedValue tests', () => {
    describe('negative values', () => {
      it('should return 10 mana when -60 is added', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[2])), -60, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 10);
      });
      it('should return 0 mana when -80 is added, and goes below 0', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[2])), -80, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 0);
      });
      it('should return 0 XP when -80 is added, and goes below 0', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[2])), -80, StudProp.LESSON_XP, false, 1, false, 0);
        assert.strictEqual(result, 0);
      });
      it('should return 21.5 XP when -10 is added, no modifier when the value is negative', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[2])), -10, StudProp.LESSON_XP, false, 1, false, 0);
        assert.strictEqual(result, 21.5);
      });
    });
    describe('mana points', () => {
      it('should return 100 mana points when 30 is added', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[3])), 30, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 100);
      });
      it('should return 600 mana points when it wolud be over 600', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[3])), 2000, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 600);
      });
      it('should return 120 mana points when 100 added, and there is a jewellery 20', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[4])), 100, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 120);
      });
    });
    describe('XP modifiers', () => {
      it('should return 36.5 floating point number when 5 is added', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[2])), 5, StudProp.LESSON_XP, false, 1, false, 0);
        assert.strictEqual(result, 36.5);
      });
      it('should return 10 mana points - no own modifier, no clan modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[0])), 10, StudProp.LESSON_XP, false, 1, false, 0);
        assert.strictEqual(result, 10);
      });
      it('should return 10.5 lesson XP points - no own modifier, 5% clan modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[0])), 10, StudProp.LESSON_XP, false, 2, false, 0);
        assert.strictEqual(result, 10.5);
      });
      it('should return 12 mana points - 20 jewellery, no clan modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[4])), 10, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 12);
      });
      it('should return 12.5 lesson XP - armour 20, 5% clan modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[5])), 10, StudProp.LESSON_XP, false, 2, false, 0);
        assert.strictEqual(result, 12.5);
      });  
    });
    describe('class specific modifiers', () => {
      it('should return 33 mana points - bard has 10% default modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[6])), 30, StudProp.MANA_POINTS, false, 1, false, 0);
        assert.strictEqual(result, 33);
      });
      it('should return 7 pet food - adventurer x2 default modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[0])), 1, StudProp.PET_FOOD, false, 1, false, 0);
        assert.strictEqual(result, 7);
      });
      it('should return 41.5 XP - warrior x2 default test modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[2])), 5, StudProp.LESSON_XP, true, 1, false, 0);
        assert.strictEqual(result, 41.5);
      });
      it('should return 42 XP - wizard x2 default test modifier + 2nd clan level 5%', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[3])), 5, StudProp.LESSON_XP, false, 2, true, 0);
        assert.strictEqual(result, 42);
      });
    });
    describe('test specific modifiers', () => {
      it('should return 77.5 XP - clan level 5 50% + 5% modifiers', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[0])), 50, StudProp.LESSON_XP, false, 5, true, 0);
        assert.strictEqual(result, 77.5);
      });
      it('should return 77.5 XP - clan level 5 50% + 5% modifiers + 20% own modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[1])), 50, StudProp.LESSON_XP, false, 5, true, 0);
        assert.strictEqual(result, 87.5);
      });
    });
    describe('input modifier', () => {
      it('should return 12 XP - has 20% input modifier', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[0])), 10, StudProp.LESSON_XP, false, 1, false, 20);
        assert.strictEqual(result, 12);
      });
      it('should return 15 XP - has 20% input modifier, 10% clan modifier and 20% armour', () => {
        const result = RealmService.countModifiedValue(JSON.parse(JSON.stringify(students[1])), 10, StudProp.LESSON_XP, false, 3, false, 20);
        assert.strictEqual(result, 15);
      });
    });
  });

  describe('addValue tests', () => {
    it('should return 1 as skill used', () => {
      const data = {
        realmId: 'not needed',
        studentId: 'not needed',
        pointType: StudProp.MANA_POINTS,
        value: -50,
        isDuel: false,
        isWinner: false
      };
      const result = RealmService.addValue(data, JSON.parse(JSON.stringify(students[0])), 1);
      assert.strictEqual(result[StudProp.SKILL_COUNTER], 1);
    });
    it('should return 2 as duel count', () => {
      const data = {
        realmId: 'not needed',
        studentId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: 5,
        isDuel: true,
        isWinner: false
      };
      const result = RealmService.addValue(data, JSON.parse(JSON.stringify(students[0])), 1);
      assert.strictEqual(result[StudProp.DUEL_COUNT], 2);
    });
    it('should have 2 pet food after substracting mana ', () => {
      const data = {
        realmId: 'not needed',
        studentId: 'not needed',
        pointType: StudProp.MANA_POINTS,
        value: -5,
        isDuel: false,
        isWinner: false
      };
      const result = RealmService.addValue(data, JSON.parse(JSON.stringify(students[1])), 1);
      assert.strictEqual(result[StudProp.PET_FOOD], 2);
    });
    it('should have 7 pet food after substracting mana (Adventurer gets double)', () => {
      const data = {
        realmId: 'not needed',
        studentId: 'not needed',
        pointType: StudProp.MANA_POINTS,
        value: -5,
        isDuel: false,
        isWinner: false
      };
      const result = RealmService.addValue(data, JSON.parse(JSON.stringify(students[0])), 1);
      assert.strictEqual(result[StudProp.PET_FOOD], 7);
    });
  });

  describe('manageClanGloryPointsAndLevelUp tests', () => {
    it('should return 5th level clan, no level up', () => {
      const result = RealmService.manageClanGloryPointsAndLevelUp(JSON.parse(JSON.stringify(clans[2])), 30);
      assert.strictEqual(result.level, 5);
    });
    it('should return 530 glory points', () => {
      const result = RealmService.manageClanGloryPointsAndLevelUp(JSON.parse(JSON.stringify(clans[2])), 30);
      assert.strictEqual(result.gloryPoints, 530);
    });
    it('should return 175 glory points', () => {
      const result = RealmService.manageClanGloryPointsAndLevelUp(JSON.parse(JSON.stringify(clans[3])), 30);
      assert.strictEqual(result.gloryPoints, 175);
    });
    it('should return level 3', () => {
      const result = RealmService.manageClanGloryPointsAndLevelUp(JSON.parse(JSON.stringify(clans[3])), 30);
      assert.strictEqual(result.level, 3);
    });
    it('should return 0 glory points if it goes under 0', () => {
      const result = RealmService.manageClanGloryPointsAndLevelUp(JSON.parse(JSON.stringify(clans[0])), -100);
      assert.strictEqual(result.gloryPoints, 0);
    });
    it('should return level 1 after substracting 50 points', () => {
      const result = RealmService.manageClanGloryPointsAndLevelUp(JSON.parse(JSON.stringify(clans[0])), -50);
      assert.strictEqual(result.level, 1);
    });
  });

  describe('addValueToAll tests', () => {
    it('should return 0 XP, student was not present', () => {
      data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: 5,
        exclude: ['603df26d9dbb783a48d60096']
      }
      const result = RealmService.addValueToAll(JSON.parse(JSON.stringify(realm)), data);
      assert.strictEqual(result.students[0][StudProp.LESSON_XP], 0);
    });
    it('should return 5 XP, student was present', () => {
      data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: 5,
        exclude: ['603df26d9dbb783a48d60096']
      }
      const result = RealmService.addValueToAll(JSON.parse(JSON.stringify(realm)), data);
      assert.strictEqual(result.students[1][StudProp.LESSON_XP], 5);
    });
  });

  describe('resetRealm tests', () => {
    it('should return 0 finishLessonMana', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.finishLessonMana, 0);
    });
    it('should return 0 xpStep', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.xpStep, 0);
    });
    it('should return 0 manaStep', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.manaStep, 0);
    });
    it('should return 0 duelStep', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.duelStep, 0);
    });
    it('should return 0 rampageXp', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.rampageXp, 0);
    });
    it('should return fresh level 1 monster', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      const level_1_monster = result.monsters.find(m => m.level === 1);
      assert.strictEqual(level_1_monster.hp, 50);
    });
    it('should return fresh level 2 monster', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      const level_2_monster = result.monsters.find(m => m.level === 2);
      assert.strictEqual(level_2_monster.hp, 100);
    });
    it('should return null as class', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].class, null);
    });
    it('should return null as class', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].clan, null);
    });
    it('should return 1 as level', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].level, 1);
    });
    it('should return 0 as cumulativeXp', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].cumulativeXp, 0);
    });
    it('should return 0 as lessonXp', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].lessonXp, 0);
    });
    it('should return 0 as manaPoints', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].manaPoints, 0);
    });
    it('should return 0 as skillUsed', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].skillUsed, 0);
    });
    it('should return 0 as petFood', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].petFood, 0);
    });
    it('should return 0 as cursePoints', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].cursePoints, 0);
    });
    it('should return 0 as duelCount', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].duelCount, 0);
    });
    it('should return 0 as weapon', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].weapon, 0);
    });
    it('should return 0 as shield', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].shield, 0);
    });
    it('should return 0 as duelCount', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].duelCount, 0);
    });
    it('should return 0 as armour', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].armour, 0);
    });
    it('should return 0 as jewellery', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].jewellery, 0);
    });
    it('should return 0 as clan list length', () => {
      const result = RealmService.resetRealm(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.clans.length, 0);
    });
  });

  describe('setModifiedStudent tests', () => {
    it('should return newName as name', () => {
      const modifiedStud = {
        name: 'newName',
        class: '',
        clan: ''
      }
      const result = RealmService.setModifiedStudent(JSON.parse(JSON.stringify(students[0])), modifiedStud);
      assert.strictEqual(result.name, 'newName');
    });
    it('should return WIZARD as class', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WIZARD',
        clan: ''
      }
      const result = RealmService.setModifiedStudent(JSON.parse(JSON.stringify(students[0])), modifiedStud);
      assert.strictEqual(result.class, 'WIZARD');
    });
    it('should return 1 as shield', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WIZARD',
        clan: '603f3b5fb70c640024be589f',
        shield: 1,
        weapon: 1
      }
      const result = RealmService.setModifiedStudent(JSON.parse(JSON.stringify(students[0])), modifiedStud);
      assert.strictEqual(result.shield, 1);
    });
    it('should return 2 as weapon', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WIZARD',
        clan: '603f3b5fb70c640024be589f',
        shield: 1,
        armour: 0,
        jewellery: 0,
        weapon: 2
      }
      const result = RealmService.setModifiedStudent(JSON.parse(JSON.stringify(students[0])), modifiedStud);
      assert.strictEqual(result.weapon, 2);
    });
    it('should return 1 as cloak', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WIZARD',
        clan: '603f3b5fb70c640024be589f',
        shield: 1,
        armour: 0,
        jewellery: 0,
        weapon: 2,
        cloak: 1
      }
      const result = RealmService.setModifiedStudent(JSON.parse(JSON.stringify(students[0])), modifiedStud);
      assert.strictEqual(result.cloak, 1);
    });
  });

  describe('areModifyStudentTypesWrong tests', () => {
    it('should return true if name is empty string', () => {
      const modifiedStud = {
        name: '',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if class is not valid', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH-',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return false if class is null, others are valid', () => {
      const modifiedStud = {
        name: 'newName',
        class: null,
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 1,
        jewellery: 1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, false);
    });
    it('should return true if clan is not valid', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f-',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 1,
        jewellery: 1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return false if clan is null, others are valid', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: null,
        weapon: 1,
        shield: 1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, false);
    });
    it('should return true if weapon is less than 0', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        xpModifier: 10,
        weapon: -1,
        shield: 1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if weapon is string', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 'dfg',
        shield: 1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if weapon is null', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: null,
        shield: 1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if shield is undefined', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: undefined,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if shield is array', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: [],
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if shield is object', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: {},
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if shield is less than 0', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: -1,
        armour: 0,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if armour is string', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 'fgh',
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if armour is null', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: null,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if armour is undefined', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: undefined,
        cloak: 1,
        jewellery: 0
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if jewellery is not empty array', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 1,
        jewellery: ['fgh']
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if jewellery is empty array', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 1,
        jewellery: []
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if jewellery is object', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 1,
        jewellery: {}
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if jewellery is less than 0', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 1,
        jewellery: -1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if armour is less than 0', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: -1,
        cloak: 1,
        jewellery: 1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if cloak is less than 0', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: -1,
        jewellery: 1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if cloak is string', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: 'fgh',
        jewellery: 1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
    it('should return true if cloak is null', () => {
      const modifiedStud = {
        name: 'newName',
        class: 'WARSMITH',
        clan: '603f3b5fb70c640024be589f',
        weapon: 1,
        shield: 1,
        armour: 1,
        cloak: null,
        jewellery: 1
      }
      const result = RealmService.areModifyStudentTypesWrong(JSON.parse(JSON.stringify(realm)), modifiedStud);
      assert.strictEqual(result, true);
    });
  });

  describe('areClansWrong tests', () => {
    it('should return false when clan is null', () => {
      const studentClan = null;
      const result = RealmService.areClansWrong(JSON.parse(JSON.stringify(realm)), studentClan);
      assert.strictEqual(result, false);
    });
    it('should return false when clan is valid', () => {
      const studentClan = '603f3b5fb70c640024be589e';
      const result = RealmService.areClansWrong(JSON.parse(JSON.stringify(realm)), studentClan);
      assert.strictEqual(result, false);
    });
    it('should return true when clan is invalid', () => {
      const studentClan = '603f3b5fb70c640024be589e--';
      const result = RealmService.areClansWrong(JSON.parse(JSON.stringify(realm)), studentClan);
      assert.strictEqual(result, true);
    });
  });

  describe('setStudentClans tests', () => {
    it('should return with no changes if mewClan is null', () => {
      const newClan = null;
      const student = JSON.parse(JSON.stringify(realm.students[0]));
      const result = RealmService.setStudentClans(JSON.parse(JSON.stringify(realm)), student, newClan);
      const modifiedStudent = result.students.find(s => s._id.toString() === student._id.toString());
      assert.strictEqual(modifiedStudent.clan, '603f3b5fb70c640024be589f');
    });
    it('should return with the same clan ID when no changes', () => {
      const newClan = '603f3b5fb70c640024be589f';
      const student = JSON.parse(JSON.stringify(realm.students[0]));
      const result = RealmService.setStudentClans(JSON.parse(JSON.stringify(realm)), student, newClan);
      const modifiedStudent = result.students.find(s => s._id.toString() === student._id.toString());
      assert.strictEqual(modifiedStudent.clan, '603f3b5fb70c640024be589f');
    });
    it('should return new clan ID, added to new clan, removed from previous clan', () => {
      const newClan = '603f3b5fb70c640024be589e';
      const student = JSON.parse(JSON.stringify(realm.students[0]));
      const result = RealmService.setStudentClans(JSON.parse(JSON.stringify(realm)), student, newClan);
      const modifiedStudent = result.students.find(s => s._id.toString() === student._id.toString());
      const prevClan = result.clans.find(c => c._id.toString() === '603f3b5fb70c640024be589f');
      const newStudentClan = result.clans.find(c => c._id.toString() === '603f3b5fb70c640024be589e');
      assert.strictEqual(modifiedStudent.clan, '603f3b5fb70c640024be589f');
      assert.strictEqual(prevClan.students.indexOf('603df26d9dbb783a48d60096'), -1);
      assert.strictEqual(newStudentClan.students.includes('603df26d9dbb783a48d60096'), true);
    });
  });

  describe('areAddValueTypesWrong tests', () => {
    it('should return false if all type is correct', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: 10,
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, false);
    });
    it('should return true if pointType is incorrect', () => {
      const data = {
        pointType: 'wrong',
        value: 10,
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is string', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: 'not number',
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is boolean', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: true,
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is empty array', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: [],
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is not empty array', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: ['value'],
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is object', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: {},
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is null', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: null,
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is undefined', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: undefined,
        isDuel: false,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if duel is not boolean', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: 10,
        isDuel: 1,
        isWinner: false
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if isWinner is not boolean', () => {
      const data = {
        pointType: StudProp.LESSON_XP,
        value: 10,
        isDuel: false,
        isWinner: 'not booelean'
      }
      const result = RealmService.areAddValueTypesWrong(data);
      assert.strictEqual(result, true);
    });
  });

  describe('areStudentsWrong tests', () => {
    it('should return false if all data is correct', () => {
      const students = [
        {
          name: 'Géza',
          class: StudProp.WARSMITH,
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: 'Béla',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), students);
      assert.strictEqual(result, false);
    });
    it('should return true if students are null', () => {
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), null);
      assert.strictEqual(result, true);
    });
    it('should return true if students are empty', () => {
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), []);
      assert.strictEqual(result, true);
    });
    it('should return true if a user name is missig', () => {
      const students = [
        {
          name: 'Géza',
          class: StudProp.WARSMITH,
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: '',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), students);
      assert.strictEqual(result, true);
    });
    it('should return true if a user has no valid class', () => {
      const students = [
        {
          name: 'Géza',
          class: 'no valid class',
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: 'Béla',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), students);
      assert.strictEqual(result, true);
    });
    it('should return true if other user has no valid class', () => {
      const students = [
        {
          name: 'Géza',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: 'Béla',
          class: 'no valid class',
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), students);
      assert.strictEqual(result, true);
    });
    it('should return true if a user has no valid clan', () => {
      const students = [
        {
          name: 'Géza',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589e----'
        },
        {
          name: 'Béla',
          class: StudProp.ADVENTURER,
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), students);
      assert.strictEqual(result, true);
    });
    it('should return true if other user has no valid clan', () => {
      const students = [
        {
          name: 'Géza',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: 'Béla',
          class: StudProp.ADVENTURER,
          clan: '603f3b5fb70c640024be589f----'
        }
      ];
      const result = RealmService.areStudentsWrong(JSON.parse(JSON.stringify(realm)), students);
      assert.strictEqual(result, true);
    });
  });

  describe('addStudents tests', () => {
    it('should return valid users are added', () => {
      const prevStudentList = realm.students.map(student => student.name);
      let newCount = 0;
      let otherCount = 0;
      prevStudentList.forEach(student => {
        if (student === 'new user') {
          newCount++;
        }
        if (student === 'other user') {
          otherCount++;
        }
      });
      assert.strictEqual(newCount, 0);
      assert.strictEqual(otherCount, 0);
      const students = [
        {
          name: 'new user',
          class: StudProp.WARSMITH,
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: 'other user',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.addStudents(JSON.parse(JSON.stringify(realm)), students);
      const studentList = result.realm.students.map(student => student.name);
      newCount = 0;
      otherCount = 0;
      studentList.forEach(student => {
        if (student === 'new user') {
          newCount++;
        }
        if (student === 'other user') {
          otherCount++;
        }
      });
      assert.strictEqual(newCount, 1);
      assert.strictEqual(otherCount, 1);
    });
    it('should return add only one student if there more with same name', () => {
      const prevStudentList = realm.students.map(student => student.name);
      let newCount = 0;
      prevStudentList.forEach(student => {
        if (student === 'new user') {
          newCount++;
        }
      });
      assert.strictEqual(newCount, 0);
      const students = [
        {
          name: 'new user',
          class: StudProp.WARSMITH,
          clan: '603f3b5fb70c640024be589e'
        },
        {
          name: 'new user',
          class: StudProp.WIZARD,
          clan: '603f3b5fb70c640024be589f'
        }
      ];
      const result = RealmService.addStudents(JSON.parse(JSON.stringify(realm)), students);
      const studentList = result.realm.students.map(student => student.name);
      newCount = 0;
      studentList.forEach(student => {
        if (student === 'new user') {
          newCount++;
        }
      });
      assert.strictEqual(newCount, 1);
    });
    it('should return not add student if the name is already exists', () => {
      const prevStudentList = realm.students.map(student => student.name);
      let newCount = 0;
      prevStudentList.forEach(student => {
        if (student === 'Butters') {
          newCount++;
        }
      });
      assert.strictEqual(newCount, 1);
      const students = [
        {
          name: 'Butters',
          class: StudProp.WARSMITH,
          clan: '603f3b5fb70c640024be589e'
        }
      ];
      const result = RealmService.addStudents(JSON.parse(JSON.stringify(realm)), students);
      const studentList = result.realm.students.map(student => student.name);
      newCount = 0;
      studentList.forEach(student => {
        if (student === 'Butters') {
          newCount++;
        }
      });
      assert.strictEqual(newCount, 1);
    });
  });

  describe('areAddToAllValuesWrong tests', () => {
    it('should return false if every prop is correct', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: 10,
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, false);
    });
    it('should return true if pointType is incorrect', () => {
      const data = {
        realmId: 'not needed',
        pointType: 'incorrect',
        value: 10,
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is string', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: 'not ok',
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if exclude type is incorrect', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: 5,
        exclude: 'not array'
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is boolean', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: false,
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is empty array', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: [],
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is not empty array', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: ['stuff'],
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is object', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: {},
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is null', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: null,
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value type is undefined', () => {
      const data = {
        realmId: 'not needed',
        pointType: StudProp.LESSON_XP,
        value: undefined,
        exclude: []
      }
      const result = RealmService.areAddToAllValuesWrong(data);
      assert.strictEqual(result, true);
    });
  });
  describe('addLessonXpToSumXp tests', () => {
    it('should match the XP values prev and after the call of the function', () => {
      assert.strictEqual(students[2].cumulativeXp, 102.75);
      assert.strictEqual(students[2].lessonXp, 31.5);
      const result = RealmService.addLessonXpToSumXp(JSON.parse(JSON.stringify(students)));
      assert.strictEqual(result[2].cumulativeXp, 134.25);
      assert.strictEqual(result[2].lessonXp, 0);
    });
  });
  describe('checkStudentLevelUp tests', () => {
    it('should match the level values prev and after the call of the function', () => {
      assert.strictEqual(realm.students[2].level, 1);
      const result = RealmService.checkStudentLevelUp(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[2].level, 2);
    });
    it('should not change student level', () => {
      assert.strictEqual(realm.students[0].level, 1);
      const result = RealmService.checkStudentLevelUp(JSON.parse(JSON.stringify(realm)));
      assert.strictEqual(result.students[0].level, 1);
    });
  });
  describe('checkAllStudentInClanLevelUp tests', () => {
    it('should match the level values prev and after the call of the function', () => {
      const clan = realmLevelUp.clans.find(c => c._id.toString() === '603f3b5fb70c640024be589f');
      assert.strictEqual(clan.gloryPoints, 0);
      const result = RealmService.checkAllStudentInClanLevelUp(
        JSON.parse(JSON.stringify(realmLevelUp)),
        JSON.parse(JSON.stringify(realmLevelUp.students[1]))
      );
      const afterClan = result.clans.find(c => c._id.toString() === '603f3b5fb70c640024be589f');
      assert.strictEqual(afterClan.gloryPoints, 30);
    });
    it('should not change glory points', () => {
      const clan = realmLevelUp.clans.find(c => c._id.toString() === '603f3b5fb70c640024be589f');
      assert.strictEqual(clan.gloryPoints, 0);
      const result = RealmService.checkAllStudentInClanLevelUp(
        JSON.parse(JSON.stringify(realmLevelUp_2)),
        JSON.parse(JSON.stringify(realmLevelUp_2.students[1]))
      );
      const afterClan = result.clans.find(c => c._id.toString() === '603f3b5fb70c640024be589f');
      assert.strictEqual(afterClan.gloryPoints, 0);
    });
  });
  describe('createClans tests', () => {
    it('should add all clans to realm', () => {
      const newClans = [
        { name: 'clan 1' },
        { name: 'clan 2' },
      ];
      const beforeClanNames = realmLevelUp.clans.map(clan => clan.name);
      assert.strictEqual(beforeClanNames.includes('clan 1'), false);
      assert.strictEqual(beforeClanNames.includes('clan 2'), false);

      const result = RealmService.createClans(JSON.parse(JSON.stringify(realmLevelUp)), newClans);
      const afterClanNames = result.clans.map(clan => clan.name);
      assert.strictEqual(afterClanNames.includes('clan 1'), true);
      assert.strictEqual(afterClanNames.includes('clan 2'), true);      
    });
    it('should add only one clan with same names', () => {
      const newClans = [
        { name: 'clan 1' },
        { name: 'clan 1' },
      ];
      const beforeClanNames = realmLevelUp.clans.map(clan => clan.name);
      let preCounter = 0;
      beforeClanNames.forEach(clan => {
        if (clan === 'clan 1') {
          preCounter++;
        }
      });
      assert.strictEqual(preCounter, 0);

      const result = RealmService.createClans(JSON.parse(JSON.stringify(realmLevelUp)), newClans);
      const afterClanNames = result.clans.map(clan => clan.name);
      let postCounter = 0;
      afterClanNames.forEach(clan => {
        if (clan === 'clan 1') {
          postCounter++;
        }
      });
      assert.strictEqual(postCounter, 1);
    });
    it('should not add clan with no names', () => {
      const newClans = [
        { name: 'clan 1' },
        { name: '' },
      ];
      const beforeClanNames = realmLevelUp.clans.map(clan => clan.name);
      assert.strictEqual(beforeClanNames.length, 1);

      const result = RealmService.createClans(JSON.parse(JSON.stringify(realmLevelUp)), newClans);
      const afterClanNames = result.clans.map(clan => clan.name);
      assert.strictEqual(afterClanNames.length, 2);
    });
    it('object has no name property, not add clan', () => {
      const newClans = [
        { noName: '' }
      ];
      const beforeClanNames = realmLevelUp.clans.map(clan => clan.name);
      assert.strictEqual(beforeClanNames.length, 1);

      const result = RealmService.createClans(JSON.parse(JSON.stringify(realmLevelUp)), newClans);
      const afterClanNames = result.clans.map(clan => clan.name);
      assert.strictEqual(afterClanNames.length, 1);
    });
  });
  describe('arePointsWrong tests', () => {
    it('should return true when points are null', () => {
      const points = null;
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when points are not array', () => {
      const points = 'string';
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when points are empty array', () => {
      const points = [];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when points id is null', () => {
      const points = [
        { name: '', id: null, xp: 10, grade: 3, xpModifier: 10 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when points id not matches', () => {
      const points = [
        { name: '', id: 'not match', xp: 10, grade: 3, xpModifier: 10 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return false when all data correct', () => {
      const points = [
        { name: '', id: 'one', xp: 10, grade: 3, xpModifier: 10 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, false);
    });
    it('should return true when xp is string', () => {
      const points = [
        { name: '', id: 'one', xp: 'fdg', grade: 3, xpModifier: 10 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when xpModifier is array', () => {
      const points = [
        { name: '', id: 'one', xp: 5, grade: 3, xpModifier: [] }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when xpModifier is null', () => {
      const points = [
        { name: '', id: 'one', xp: 5, grade: 3, xpModifier: null }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when xp is null', () => {
      const points = [
        { name: '', id: 'one', xp: undefined, grade: 3, xpModifier: 0 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when xp is object', () => {
      const points = [
        { name: '', id: 'one', xp: {}, grade: 3, xpModifier: 0 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when xp is smaller than 0', () => {
      const points = [
        { name: '', id: 'one', xp: -1, grade: 3, xpModifier: 0 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
    it('should return true when xpModifier is smaller than 0', () => {
      const points = [
        { name: '', id: 'one', xp: 5, grade: 3, xpModifier: -1 }
      ];
      const studentIds = ['one', 'two', 'three'];
      const result = RealmService.arePointsWrong(studentIds, points);
      assert.strictEqual(result, true);
    });
  });
  describe('addTest tests', () => {
    it('should return the modified XPs', () => {
      const points = [
        { name: '', id: '602b961f21ae205a2cdb9b63', xp: 10, grade: 3 },
        { name: '', id: '602b961f21ae205a2cdb9b64', xp: 10, grade: 3 }
      ];
      const result = RealmService.addTest(JSON.parse(JSON.stringify(realmLevelUp)), points);
      assert.strictEqual(result.students[0].lessonXp, 30);
      assert.strictEqual(result.students[1].lessonXp, 20);
    });
  });
  describe('areStepsWrong tests', () => {
    it('should return false if all value is number', () => {
      const result = RealmService.areStepsWrong(1, 1, 1, 2, 1);;
      assert.strictEqual(result, false);
    });
    it('should return false if one value is string', () => {
      const result = RealmService.areStepsWrong('fg', 1, 1, 1, 1);;
      assert.strictEqual(result, true);
    });
    it('should return false if one value is null', () => {
      const result = RealmService.areStepsWrong(1, null, 1, 1, 1);;
      assert.strictEqual(result, true);
    });
    it('should return false if one value is undefined', () => {
      const result = RealmService.areStepsWrong(1, 1, undefined, 1, 1);
      assert.strictEqual(result, true);
    });
    it('should return false if one value is array', () => {
      const result = RealmService.areStepsWrong(1, 1, 1, [], 1);;
      assert.strictEqual(result, true);
    });
    it('should return false if one value is empty array', () => {
      const result = RealmService.areStepsWrong(1, ['fg'], 1, 1, 1);;
      assert.strictEqual(result, true);
    });
    it('should return false if one value is object', () => {
      const result = RealmService.areStepsWrong(1, 1, 1, 1, {});;
      assert.strictEqual(result, true);
    });
  });
  describe('isUserCollaborator tests', () => {
    it('should return true if user is collaborator', () => {
      const userId = '602b961f21ae205a2cdb9b62';
      const result = RealmService.isUserCollaborator(realmCollaborators.collaborators, userId);
      assert.strictEqual(result, true);
    });
    it('should return false if user is not collaborator', () => {
      const userId = '602b961f21ae205a2cdb9b65';
      const result = RealmService.isUserCollaborator(realmCollaborators.collaborators, userId);
      assert.strictEqual(result, false);
    });
  });
  describe('findUserRealms tests', () => {
    it('should return one realm with correct ID', () => {
      const userId = '602b961f21ae205a2cdb9b62';
      const result = RealmService.findUserRealms(MockRealms, userId);
      assert.strictEqual(result[0].id, '602b95dc21ae205a2cdb9b51');
    });
    it('should return no realm', () => {
      const userId = '602b961f21ae205a2cdb9b65';
      const result = RealmService.findUserRealms(MockRealms, userId);
      assert.strictEqual(result.length, 0);
    });
    it('should return two realms', () => {
      const userId = '602b961f21ae205a2cdb9b64';
      const result = RealmService.findUserRealms(MockRealms, userId);
      assert.strictEqual(result.length, 2);
    });
  });
  describe('getPossibleCollaborators tests', () => {
    it('should return 2 possible collaborators', () => {
      const currentCollaborators = ['11111111'];
      const result = RealmService.getPossibleCollaborators(googleUsers, currentCollaborators);
      assert.strictEqual(result.length, 2);
    });
    it('should not contain the current collaborators (1 coll)', () => {
      const currentCollaborators = ['11111111'];
      const result = RealmService.getPossibleCollaborators(googleUsers, currentCollaborators);
      currentCounter = 0;
      for (const elem of result) {
        if (elem.id.toString() === currentCollaborators[0]) {
          currentCounter++;
        }
      }
      assert.strictEqual(currentCounter, 0);
    });
    it('should return 1 possible collaborators', () => {
      const currentCollaborators = ['11111111', '22222222'];
      const result = RealmService.getPossibleCollaborators(googleUsers, currentCollaborators);
      assert.strictEqual(result.length, 1);
    });
    it('should not contain the current collaborators (2 coll)', () => {
      const currentCollaborators = ['11111111', '22222222'];
      const result = RealmService.getPossibleCollaborators(googleUsers, currentCollaborators);
      currentCounter = 0;
      for (const elem of result) {
        if (elem.id === currentCollaborators[0] || elem.id === currentCollaborators[1]) {
          currentCounter++;
        }
      }
      assert.strictEqual(currentCounter, 0);
    });
  });
  describe('saveCollaborators tests', () => {
    it('should return 4 as number of collaborators when add', () => {
      const collaborators = ['602b961f21ae205a2cdb9b67', '602b961f21ae205a2cdb9b68'];
      const result = RealmService.saveCollaborators(JSON.parse(JSON.stringify(realmCollaborators)), true, collaborators);
      assert.strictEqual(result.collaborators.length, 4);
    });
    it('should return 1 as number of collaborators when remove', () => {
      const collaborators = ['602b961f21ae205a2cdb9b62'];
      const result = RealmService.saveCollaborators(JSON.parse(JSON.stringify(realmCollaborators)), false, collaborators);
      assert.strictEqual(result.collaborators.length, 1);
    });
  });
  describe('areMonsterDataWrong tests', () => {
    it('should return false as all data correct', () => {
      const data = {
        level: 1,
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, false);
    });
    it('should return true if level is string', () => {
      const data = {
        level: 'gh',
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is null', () => {
      const data = {
        level: null,
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is undefined', () => {
      const data = {
        level: undefined,
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is array', () => {
      const data = {
        level: [],
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is object', () => {
      const data = {
        level: {},
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is string', () => {
      const data = {
        level: 1,
        throwerId: 'string',
        isStudent: true,
        value: 'gh'
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is null', () => {
      const data = {
        level: 1,
        throwerId: 'string',
        isStudent: true,
        value: null
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is undefined', () => {
      const data = {
        level: 1,
        throwerId: 'string',
        isStudent: true,
        value: undefined
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is array', () => {
      const data = {
        level: 1,
        throwerId: 'string',
        isStudent: true,
        value: []
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is object', () => {
      const data = {
        level: 1,
        throwerId: 'string',
        isStudent: true,
        value: {}
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is smaller than 1', () => {
      const data = {
        level: 0,
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is bigger than 4', () => {
      const data = {
        level: 5,
        throwerId: 'string',
        isStudent: true,
        value: 1
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is throwerId is number', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: 12,
        isStudent: true,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is throwerId is null', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: null,
        isStudent: true,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is throwerId is array', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: [],
        isStudent: true,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if level is throwerId is object', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: {},
        isStudent: true,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if isStudent is string', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: 'this is an ID',
        isStudent: 'tz',
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if isStudent is number', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: 'this is an ID',
        isStudent: 56,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if isStudent is null', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: 'this is an ID',
        isStudent: null,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if isStudent is array', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: 'this is an ID',
        isStudent: [],
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if isStudent is object', () => {
      const data = {
        level: 5,
        value: 1,
        throwerId: 'this is an ID',
        isStudent: {},
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if value is smaller than 0', () => {
      const data = {
        level: 5,
        value: -1,
        throwerId: 'this is an ID',
        isStudent: true,
      };
      const result = RealmService.areMonsterDataWrong(data);
      assert.strictEqual(result, true);
    });
  });
  describe('modifyMonster tests', () => {
    it('should return 49 as HP', () => {
      const data = {
        level: 1,
        value: 1
      };
      const result = RealmService.modifyMonster(JSON.parse(JSON.stringify(monsters)), data);
      const currMonster = result.find(m => m.level === 1);
      assert.strictEqual(currMonster.hp, 49);
    });
    it('should substract from next monsters HP', () => {
      const data = {
        level: 2,
        value: 5
      };
      const result = RealmService.modifyMonster(JSON.parse(JSON.stringify(monsters)), data);
      const currMonster = result.find(m => m.level === 3);
      assert.strictEqual(currMonster.hp, 196);
    });
    it('should set the last monster HP to 0', () => {
      const data = {
        level: 4,
        value: 5
      };
      const result = RealmService.modifyMonster(JSON.parse(JSON.stringify(monsters)), data);
      const currMonster = result.find(m => m.level === 4);
      assert.strictEqual(currMonster.hp, 0);
    });
  });
  describe('areClanDataWrong tests', () => {
    it('should return false is all data is correct', () => {
      const data = {
        gloryPoints: 1,
        fortress: 1,
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, false);
    });
    it('should return true if gloryPoints are null', () => {
      const data = {
        gloryPoints: null,
        fortress: 1,
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if gloryPoints are undefined', () => {
      const data = {
        gloryPoints: undefined,
        fortress: 1,
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if fortress is array', () => {
      const data = {
        gloryPoints: 1,
        fortress: [],
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if fortress is object', () => {
      const data = {
        gloryPoints: 1,
        fortress: {},
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if fortress is less than 0', () => {
      const data = {
        gloryPoints: 1,
        fortress: -1,
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if fortress is bigger than 4', () => {
      const data = {
        gloryPoints: 1,
        fortress: 5,
        army: 1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if army is less than 0', () => {
      const data = {
        gloryPoints: 1,
        fortress: 1,
        army: -1
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
    it('should return true if army is bigger than 4', () => {
      const data = {
        gloryPoints: 1,
        fortress: 1,
        army: 5
      };
      const result = RealmService.areClanDataWrong(data);
      assert.strictEqual(result, true);
    });
  });
  describe('updateMonsterHit tests', () => {
    it('should return 0 as pre, 1 as post', () => {
      const studentIds = ['603408baecd71a466cd7e772'];
      const preStudent = students.find(s => s._id === studentIds[0]);
      assert.strictEqual(preStudent.monsterHit, 0);
      const result = RealmService.updateMonsterHit(JSON.parse(JSON.stringify(students)), studentIds, 1);
      const postStudent = result.find(s => s._id === studentIds[0]);
      assert.strictEqual(postStudent.monsterHit, 1);
    });
    it('should return 0 as pre, 1 as post for 0., 5 and 6 for 1.', () => {
      const studentIds = ['603408baecd71a466cd7e772', '603df26d9dbb783a48d60096'];
      const preStudent_1 = students.find(s => s._id === studentIds[0]);
      const preStudent_2 = students.find(s => s._id === studentIds[1]);
      assert.strictEqual(preStudent_1.monsterHit, 0);
      assert.strictEqual(preStudent_2.monsterHit, 5);
      const result = RealmService.updateMonsterHit(JSON.parse(JSON.stringify(students)), studentIds, 1);
      const postStudent_1 = result.find(s => s._id === studentIds[0]);
      const postStudent_2 = result.find(s => s._id === studentIds[1]);
      assert.strictEqual(postStudent_1.monsterHit, 1);
      assert.strictEqual(postStudent_2.monsterHit, 6);
    });
  });
  describe('handleClanLevelUpCloakChange tests', () => {
    it('should not add any points, there was no clan level change', () => {
      const prevStudent = mockRealmCloakUp.students.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(prevStudent.cloak, 0);
      const clan = JSON.parse(JSON.stringify(mockRealmCloakUp.clans[1]));
      clan.level = 4;
      const prevLevel = 4;
      const result = RealmService.handleClanLevelUpCloakChange(JSON.parse(JSON.stringify(mockRealmCloakUp.students)), clan, prevLevel);
      const student = result.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(student.cloak, 0);
    });
    it('should not add any points, clan didnt reach level 4', () => {
      const prevStudent = mockRealmCloakUp.students.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(prevStudent.cloak, 0);
      const clan = JSON.parse(JSON.stringify(mockRealmCloakUp.clans[1]));
      clan.level = 3;
      const prevLevel = 2;
      const result = RealmService.handleClanLevelUpCloakChange(JSON.parse(JSON.stringify(mockRealmCloakUp.students)), clan, prevLevel);
      const student = result.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(student.cloak, 0);
    });
    it('should add 2 points, clan reached level 4', () => {
      const prevStudent = mockRealmCloakUp.students.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(prevStudent.cloak, 0);
      const clan = JSON.parse(JSON.stringify(mockRealmCloakUp.clans[1]));
      clan.level = 4;
      const prevLevel = 3;
      const result = RealmService.handleClanLevelUpCloakChange(JSON.parse(JSON.stringify(mockRealmCloakUp.students)), clan, prevLevel);
      const student = result.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(student.cloak, 2);
    });
    it('should add 3 points, clan reached level 5', () => {
      const prevStudent = mockRealmCloakUp.students.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(prevStudent.cloak, 0);
      const clan = JSON.parse(JSON.stringify(mockRealmCloakUp.clans[1]));
      clan.level = 5;
      const prevLevel = 4;
      const result = RealmService.handleClanLevelUpCloakChange(JSON.parse(JSON.stringify(mockRealmCloakUp.students)), clan, prevLevel);
      const student = result.find(s => s._id === '603df26d9dbb783a48d60096');
      assert.strictEqual(student.cloak, 3);
    });
  });
});
