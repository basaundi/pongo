// Generated by CoffeeScript 1.6.3
(function() {
  describe("Connection", function() {
    var con;
    con = null;
    beforeEach(function() {
      sessionStorage.clear();
      return con = new Pongo.Connection(sessionStorage);
    });
    it("should be able to retrieve databases", function() {
      var db;
      db = con.db('mydb');
      return expect(db.constructor).toEqual(Pongo.Database);
    });
    return describe("Database", function() {
      var db;
      db = null;
      beforeEach(function() {
        sessionStorage.clear();
        return db = con.db('mydb');
      });
      it("should be able to retrieve collections", function() {
        var col;
        expect(db.col).toBeDefined();
        col = db.col('mycol');
        col.insert({
          x: 9
        });
        return expect(col.count()).toEqual(1);
      });
      return describe("Collection", function() {
        var col, docs;
        col = null;
        docs = [
          {
            'username': 'root',
            'password': 'toor',
            'super': true,
            'uid': 0
          }, {
            'username': 'bill',
            'password': '1234',
            'shell': 'bash',
            'uid': 1004
          }, {
            'foo': -9
          }
        ];
        beforeEach(function() {
          sessionStorage.clear();
          return col = db.col('mycol');
        });
        it("can do basic CRUD operations", function() {
          var cur;
          expect(col).toBeDefined();
          expect(col.count()).toEqual(0);
          col.insert(docs[0]);
          expect(col.count()).toEqual(1);
          col.insert(docs[1]);
          col.insert(docs[2]);
          expect(col.count()).toEqual(3);
          cur = col.find();
          expect(cur.next().username).toEqual('root');
          expect(cur.next().shell).toEqual('bash');
          col.update({}, {
            'shell': 'zsh'
          });
          cur = col.find();
          expect(cur.next().shell).toEqual('zsh');
          col.remove({});
          return expect(col.count()).toEqual(0);
        });
        it("performs partial updates", function() {
          var cur;
          col.insert(docs);
          col.update({}, {
            $set: {
              foo: 10
            }
          });
          cur = col.find();
          expect(cur.next().foo).toEqual(10);
          expect(cur.next().foo).toBeUndefined();
          expect(cur.next().foo).toEqual(-9);
          col.update({}, {
            $set: {
              foo: 10
            }
          }, {
            multi: true
          });
          cur = col.find();
          expect(cur.next().foo).toEqual(10);
          expect(cur.next().foo).toEqual(10);
          return expect(cur.next().foo).toEqual(10);
        });
        it("can do batch insert", function() {
          var cur;
          col.insert(docs);
          expect(col.count()).toEqual(3);
          cur = col.find();
          expect(cur.next().username).toEqual('root');
          return expect(cur.next().shell).toEqual('bash');
        });
        it("can query", function() {
          var cur;
          col.insert(docs);
          cur = col.find({
            username: 'bill'
          });
          expect(cur.next().shell).toEqual('bash');
          cur = col.find({
            uid: {
              $gt: 100
            }
          });
          return expect(cur.next().uid).toEqual(1004);
        });
        it("can load array", function() {
          var arr, cur;
          col.insert(docs);
          cur = col.find();
          arr = cur.toArray();
          return expect(arr.length).toEqual(3);
        });
        return it("stores _id properly", function() {
          var o;
          col.insert(docs);
          o = col.find().next();
          expect(typeof o._id).toEqual("string");
          return expect(o._id.length).toEqual(24);
        });
      });
    });
  });

}).call(this);
