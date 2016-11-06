describe("Player", function() {
  var Calculator = require('../../src/calculator.js');
  var calculator;

  beforeEach(function() {
    calculator = new Calculator(50000);
  });


  fdescribe("calculator methods", function() {
    it("return income", function() {
      expect(calculator.income).toEqual(50000);
    });

    describe("calculateTaxes", function() {
        it("should apply a single tax bracket", function() {
          expect(calculator.calculateTaxes(9275)).toEqual(9275 * 0.10);
        });

        it("apply multiple tax brackets", function() {
          expect(calculator.calculateTaxes(37650)).toEqual(5183.75);
        });

        it("applying all but the last two tax brackets", function() {
          expect(calculator.calculateTaxes(200000)).toEqual(49529.25);
        });
      });
    });



  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
});
