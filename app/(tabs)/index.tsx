import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, RefreshControl  } from "react-native";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const [url, setUrl] = useState("https://www.google.com");
  const [refreshing, setRefreshing] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const webViewRef = useRef<WebView>(null);

  const loadUrl = () => {
    if (!inputUrl.trim()) return;

    // Check if it's a valid URL
    const isUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(inputUrl.trim());

    if (isUrl) {
      // Handle URL
      const formattedUrl = inputUrl.trim().toLowerCase();
      const fullUrl = formattedUrl.startsWith('http') ? formattedUrl : `https://${formattedUrl}`;
      setUrl(fullUrl);
    } else {
      // Handle search query
      const searchQuery = encodeURIComponent(inputUrl.trim());
      setUrl(`https://www.google.com/search?q=${searchQuery}`);
    }

    setInputUrl(""); // Clear input after loading
  };

  const goBack = () => {
    webViewRef.current?.goBack();
  };

  const goForward = () => {
    webViewRef.current?.goForward();
  };

  const goHome = () => {
    setUrl("https://www.google.com");
    setInputUrl("");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.input}
          placeholder="Search or enter website"
          placeholderTextColor="#A8B5C3"
          value={inputUrl}
          onChangeText={setInputUrl}
          onSubmitEditing={loadUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <TouchableOpacity style={styles.goButton} onPress={loadUrl}>
          <Text style={styles.goText}>Go</Text>
        </TouchableOpacity>
      </View>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          injectedJavaScript={`
            document.body.style.backgroundColor = '#F9F9F9';
            true;
          `}
        />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={goBack}>
          <Text style={styles.icon}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goForward}>
          <Text style={styles.icon}>▶</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goHome}>
          <Text style={styles.icon}>⾕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9", // Soft beige background
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#333",
    borderColor: "#D3D3D3",
    borderWidth: 1,
  },
  goButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#A8B5C3",
    borderRadius: 8,
  },
  goText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
    color: "#A8B5C3", // Muted teal
  },
});
