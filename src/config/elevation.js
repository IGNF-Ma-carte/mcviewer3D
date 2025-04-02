export default {
  "IGN_HIGHRES": {
    "id": "IGN_MNT_HIGHRES",
    "noDataValue" : -99999,
    "updateStrategy": {
      "type": 1,
      "options": {
        "groups": [11, 14]
      }
    },
    "source": {
      "url": "https://data.geopf.fr/wmts",
        "crs": "EPSG:4326",
      "format": "image/x-bil;bits=32",
      "attribution" : {
        "name":"IGN",
        "url":"http://www.ign.fr/"
      },
      "name": "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES",
      "tileMatrixSet": "WGS84G",
      "tileMatrixSetLimits": {
        "11": {
          "minTileRow": 442,
          "maxTileRow": 1267,
          "minTileCol": 1344,
          "maxTileCol": 2683
        },
        "12": {
          "minTileRow": 885,
          "maxTileRow": 2343,
          "minTileCol": 3978,
          "maxTileCol": 5126
        },
        "13": {
          "minTileRow": 1770,
          "maxTileRow": 4687,
          "minTileCol": 7957,
          "maxTileCol": 10253
        },
        "14": {
          "minTileRow": 3540,
          "maxTileRow": 9375,
          "minTileCol": 15914,
          "maxTileCol": 20507
        }
      }
    }
  },
  "WORLD_SRTM3": {
    "id": "MNT_WORLD_SRTM3",
    "noDataValue": -99999,
    "updateStrategy": {
      "type": 1,
      "options": {
        "groups": [3, 7, 9]
      }
    },
    "source": {
      "format": "image/x-bil;bits=32",
      "crs": "EPSG:4326",
      "url": "https://data.geopf.fr/wmts",
      "name": "ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3",
      "tileMatrixSet": "WGS84G",
      "tileMatrixSetLimits": {
        "3": {
          "minTileRow": 1,
          "maxTileRow": 6,
          "minTileCol": 0,
          "maxTileCol": 16
        },
        "4": {
          "minTileRow": 2,
          "maxTileRow": 12,
          "minTileCol": 0,
          "maxTileCol": 32
        },
        "5": {
          "minTileRow": 5,
          "maxTileRow": 25,
          "minTileCol": 0,
          "maxTileCol": 64
        },
        "6": {
          "minTileRow": 10,
          "maxTileRow": 51,
          "minTileCol": 0,
          "maxTileCol": 128
        },
        "7": {
          "minTileRow": 20,
          "maxTileRow": 103,
          "minTileCol": 0,
          "maxTileCol": 256
        },
        "8": {
          "minTileRow": 41,
          "maxTileRow": 207,
          "minTileCol": 0,
          "maxTileCol": 512
        },
        "9": {
          "minTileRow": 82,
          "maxTileRow": 415,
          "minTileCol": 0,
          "maxTileCol": 1024
        },
        "10": {
          "minTileRow": 164,
          "maxTileRow": 830,
          "minTileCol": 0,
          "maxTileCol": 2048
        }
    }
    }
  }
}